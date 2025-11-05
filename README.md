🌟 AI Product Trend Predictor
🧠 Overview

The AI Product Trend Predictor is a full-stack machine learning and data visualization project that predicts whether a product is trending or not trending using sentiment analysis, ratings, and review counts.

It uses Flipkart’s product dataset to analyze reviews and product descriptions, applies TextBlob for sentiment scoring, and presents the insights through an interactive React dashboard with real-time visualizations, forecast charts, and keyword clouds.

This project demonstrates practical data science and full-stack development skills — perfect for portfolios or academic submission.

🚀 Features

✅ Predicts Trending vs. Not Trending products
✅ Performs Sentiment Analysis on product reviews
✅ Generates Keyword Cloud from frequent review terms
✅ Displays 12-Month Forecast Trends
✅ Provides Dark/Light Mode UI
✅ Built with Flask (Backend) and React (Frontend)

🧰 Tech Stack

Frontend:

React.js
TailwindCSS
Framer Motion
Recharts
React WordCloud
Axios

Backend:

Flask
Flask-CORS
Pandas
NumPy
TextBlob
Logging
OS, Random

Dataset:
Flipkart Product Dataset (contains product name, description, ratings, reviews, and pricing)

Libraries Used:
Frontend:
  react, axios, framer-motion, recharts, react-wordcloud, tailwindcss

Backend:
  flask, flask-cors, pandas, numpy, textblob

Installation
Clone the Repository
git clone https://github.com/chinmay655/AI-Product-Trend-Predictor.git
cd ai-product-trend-predictor

Backend Setup (Flask)
cd backend
pip install -r requirements.txt

AI Product Trend Predictor 
================================

Structure
- backend/: Flask API
- frontend/: React + Tailwind dashboard

Quick start (backend)
---------------------
1. cd backend
2. python3 -m venv venv
3. source venv/bin/activate   (Linux/Mac) or venv\Scripts\activate (Windows)
4. pip install -r requirements.txt
5. python app.py
Flask server will run on http://localhost:5000

Quick start (frontend)
----------------------
1. cd frontend
2. npm install
3. npm start
The React dev server runs on http://localhost:3000
You may need to set REACT_APP_API_BASE to http://localhost:5000 if different.


Project Structure:

AI-Product-Trend-Predictor/
│
├── backend/
│   ├── app.py
│   ├── flipkart_com-ecommerce_sample.csv
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Chart.js
│   │   │   ├── WordCloud.js
│   │   │   ├── SentimentSummary.js
│   │   ├── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md


How It Works:

Flask loads the Flipkart dataset and cleans product details.
Sentiment analysis is performed using TextBlob on the product description.
A weighted trend score is computed using Sentiment + Rating + Review Count.
React fetches these results from the API and visualizes them using Recharts and WordCloud.
The app displays Trending and Non-Trending product lists interactively.


Use Cases:

Trend analysis for e-commerce platforms
Academic / student ML projects
Business insight dashboards
Full-stack data visualization demonstrations

Author:

Chinmay Ghogale
Final-year B.Sc. IT Student | Python | Flask | React | Data Science Enthusiast
