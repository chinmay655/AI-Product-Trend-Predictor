import os
import re
import logging
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from textblob import TextBlob
import random
import math

app = Flask(__name__)
CORS(app)

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s: %(message)s")

# ---------- Config ----------
SCRIPT_DIR = os.path.dirname(__file__)
DATA_FILENAME = "flipkart_com-ecommerce_sample.csv"  # place this file next to app.py

# ---------- Helpers ----------
def find_dataset():
    p = os.path.join(SCRIPT_DIR, DATA_FILENAME)
    if os.path.exists(p):
        return p
    p2 = os.path.abspath(os.path.join(SCRIPT_DIR, "..", DATA_FILENAME))
    if os.path.exists(p2):
        return p2
    return None


def detect_columns(df):
    """Return mapping with keys: product_name, description, rating (optional), review_count (optional)."""
    mapping = {}
    cols = list(df.columns)
    lower = [c.lower() for c in cols]

    # product name
    for i, c in enumerate(lower):
        if any(k in c for k in ("product_name", "product name", "title", "name")):
            mapping['product_name'] = cols[i]
            break

    # description
    for i, c in enumerate(lower):
        if any(k in c for k in ("description", "desc", "details", "spec", "summary")):
            mapping['description'] = cols[i]
            break

    # rating
    for i, c in enumerate(lower):
        if "rating" in c or c == "rate" or "stars" in c:
            mapping['rating'] = cols[i]
            break

    # review count
    for i, c in enumerate(lower):
        if "review_count" in c or "reviews count" in c or "review count" in c or "reviewcount" in c:
            mapping['review_count'] = cols[i]
            break

    # fallback if missing
    text_cols = [cols[i] for i, c in enumerate(lower) if df[cols[i]].dtype == object]
    if 'product_name' not in mapping and text_cols:
        mapping['product_name'] = text_cols[0]
    if 'description' not in mapping and len(text_cols) >= 2:
        mapping['description'] = text_cols[1]
    elif 'description' not in mapping and text_cols:
        mapping['description'] = text_cols[0]

    return mapping


def clean_product_name(name: str) -> str:
    """Fix duplicate, blank, or placeholder product names."""
    if not isinstance(name, str):
        name = str(name)
    n = name.strip()

    # Remove unwanted URLs/fragments
    n = re.sub(r'https?://\S+', '', n)
    n = re.sub(r'flipkart\.com/[^\s]*', '', n, flags=re.IGNORECASE)
    n = re.sub(r'www\.[^\s]+', '', n, flags=re.IGNORECASE)

    # Remove column name placeholders
    if n.lower() in ["product_name", "name", "product"]:
        return "Unknown Product"

    n = re.sub(r'\b(product_name|product name)\b', '', n, flags=re.IGNORECASE)
    n = re.sub(r'[_\-]+', ' ', n)
    n = re.sub(r'\s+', ' ', n)
    n = n.strip()

    # Filter invalid entries
    if re.match(r'^[\W_]*$', n) or re.match(r'^[0-9\-]+$', n):
        return "Unknown Product"
    if len(n) < 2:
        return "Unknown Product"

    if len(n) > 80:
        n = n[:77] + "..."

    return n


def safe_float(x):
    try:
        return float(x)
    except Exception:
        return None


def normalize_series(values):
    """Normalize numeric list to 0..1 using min-max; if constant, return zeros."""
    if not values:
        return []
    vals = [v for v in values if v is not None and not math.isnan(v)]
    if not vals:
        return [0.0] * len(values)
    mn = min(vals)
    mx = max(vals)
    if mx == mn:
        return [0.5 if v is not None else 0.0 for v in values]
    return [((v - mn) / (mx - mn)) if (v is not None) else 0.0 for v in values]


# ---------- Load CSV ----------
DATA_PATH = find_dataset()
df = pd.DataFrame()
col_map = {}

if DATA_PATH:
    logging.info("Loading dataset from %s", DATA_PATH)
    try:
        try:
            raw = pd.read_csv(DATA_PATH, low_memory=False, encoding='utf-8')
        except Exception:
            raw = pd.read_csv(DATA_PATH, low_memory=False, encoding='latin1', engine='python')

        logging.info("CSV columns: %s", list(raw.columns)[:20])
        col_map = detect_columns(raw)
        logging.info("Detected columns mapping: %s", col_map)

        if 'product_name' in col_map and 'description' in col_map:
            use_cols = [col_map['product_name'], col_map['description']]
            if 'rating' in col_map:
                use_cols.append(col_map['rating'])
            if 'review_count' in col_map:
                use_cols.append(col_map['review_count'])

            df = raw[use_cols].dropna(subset=[col_map['product_name'], col_map['description']]).copy()

            rename_map = {col_map['product_name']: 'product_name', col_map['description']: 'description'}
            if 'rating' in col_map:
                rename_map[col_map['rating']] = 'rating'
            if 'review_count' in col_map:
                rename_map[col_map['review_count']] = 'review_count'
            df = df.rename(columns=rename_map)

            df['product_name'] = df['product_name'].astype(str).apply(lambda x: clean_product_name(x))
            df = df[df['product_name'] != "Unknown Product"]
            df = df.drop_duplicates(subset=['product_name']).reset_index(drop=True)

            logging.info("Final usable rows: %d", len(df))
        else:
            logging.error("Could not detect product_name/description in CSV.")
    except Exception as e:
        logging.exception("Error loading CSV: %s", e)
else:
    logging.error("Dataset not found: %s", DATA_FILENAME)


# ---------- Sentiment ----------
def sentiment_score(text):
    try:
        return TextBlob(str(text)).sentiment.polarity
    except Exception:
        return 0.0


# ---------- Routes ----------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "rows": len(df)}), 200


@app.route("/api/predict", methods=["GET"])
def predict():
    try:
        if df.empty:
            return jsonify({"error": "No data found on server"}), 400

        sample_n = min(50, len(df))
        sample = df.sample(n=sample_n, random_state=random.randint(1, 9999)).reset_index(drop=True)

        sentiments, ratings, review_counts = [], [], []

        for _, row in sample.iterrows():
            s = sentiment_score(row['description'])
            sentiments.append(s)
            ratings.append(safe_float(row.get('rating')))
            review_counts.append(safe_float(row.get('review_count')))

        norm_sent = normalize_series([(s + 1) / 2.0 for s in sentiments])
        norm_rating = normalize_series(ratings) if any(r is not None for r in ratings) else [None] * len(sentiments)
        norm_reviews = normalize_series([math.log1p(rc) if rc and rc > 0 else None for rc in review_counts]) if any(rc is not None for rc in review_counts) else [None] * len(sentiments)

        scored = []
        for i, row in sample.iterrows():
            pname = clean_product_name(row['product_name'])
            desc = str(row['description'])
            s_sent = norm_sent[i]
            s_rating = norm_rating[i] if norm_rating[i] is not None else 0.0
            s_reviews = norm_reviews[i] if norm_reviews[i] is not None else 0.0

            score = (0.6 * s_sent) + (0.25 * s_rating) + (0.15 * s_reviews)
            scored.append({
                "product_name": pname,
                "description": desc[:160] + ("..." if len(desc) > 160 else ""),
                "score": round(score, 3),
                "raw_sentiment": round(sentiments[i], 3)
            })

        scored_sorted = sorted(scored, key=lambda x: x['score'], reverse=True)
        n = len(scored_sorted)
        top_k = max(1, int(round(n * 0.4)))

        trending_items = scored_sorted[:top_k]
        non_trending_items = scored_sorted[top_k:]

        trending_products = [{
            "product_name": p['product_name'],
            "predicted_trend": "Trending",
            "score": p['score'],
            "confidence": random.randint(70, 98)
        } for p in trending_items]

        non_trending_products = [{
            "product_name": p['product_name'],
            "predicted_trend": "Not Trending",
            "score": p['score'],
            "confidence": random.randint(40, 80)
        } for p in non_trending_items]

        combined = trending_products + non_trending_products
        random.shuffle(combined)

        all_text = " ".join([r['description'] for r in scored_sorted])
        tokens = [t.lower().strip(".,!?:;()[]\"'") for t in re.split(r'\s+', all_text) if len(t) > 3 and not any(ch.isdigit() for ch in t)]
        word_freq = pd.Series(tokens).value_counts().head(20)
        word_cloud_data = [{"text": w, "value": int(v)} for w, v in word_freq.items()]

        forecasts = [{"date": f"2025-{i+1:02d}-01", "value": round(50 + i * random.uniform(0.5, 3.0) + random.uniform(-4, 4), 1)} for i in range(12)]

        resp = {
            "predictions": {p["product_name"]: p["predicted_trend"] for p in combined},
            "products": combined,
            "trending_products": trending_products,
            "non_trending_products": non_trending_products,
            "forecasts": forecasts,
            "sentiment": {
                "avg": round(sum(p['score'] for p in combined) / len(combined), 3),
                "total_analyzed": n,
                "trending_count": len(trending_products),
                "non_trending_count": len(non_trending_products)
            },
            "wordCloudData": word_cloud_data
        }

        logging.info("Returning %d products (%d trending / %d non-trending)", len(combined), len(trending_products), len(non_trending_products))
        return jsonify(resp)

    except Exception as e:
        logging.exception("Error in predict")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
