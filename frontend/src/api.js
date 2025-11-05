// frontend/src/api.js
import axios from 'axios';

// Base URL of your Flask backend
const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Fetches product trend predictions from Flask backend
 * (works with both dummy & real Flipkart dataset)
 */
export const fetchTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/predict`, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    let data = response.data || {};

    // ✅ Clean and format predictions
    if (data.predictions) {
      const cleanedPredictions = {};
      for (const [key, value] of Object.entries(data.predictions)) {
        // Remove URLs, HTML tags, and weird long texts
        const cleanKey = key
          .replace(/https?:\/\/[^\s]+/g, '') // remove URLs
          .replace(/<[^>]*>/g, '')           // remove HTML
          .replace(/\s+/g, ' ')              // normalize spaces
          .trim();

        // Keep only if name looks valid
        if (cleanKey && cleanKey.length > 2 && cleanKey.length < 100) {
          cleanedPredictions[cleanKey] = value;
        }
      }
      data.predictions = cleanedPredictions;
    }

    // ✅ Fallbacks to avoid “undefined” errors
    data.forecasts = data.forecasts || [];
    data.sentiment = data.sentiment || { avg: 0, total_analyzed: 0 };
    data.wordCloudData = data.wordCloudData || [];

    return data;

  } catch (error) {
    // More detailed logging for debugging
    console.error('❌ fetchTrends error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
    });

    // Helpful UI alert
    if (error.code === 'ECONNABORTED') {
      alert('Request timed out. Backend may be slow.');
    } else if (!error.response) {
      alert('Cannot connect to backend. Make sure Flask is running on http://127.0.0.1:5000');
    } else {
      alert(`Backend error: ${error.response.status} — ${JSON.stringify(error.response.data)}`);
    }

    return null;
  }
};

/**
 * (Optional) Fetch detailed product info later if needed
 */
export const fetchProductDetails = async (productName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${productName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};
