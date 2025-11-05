import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from './Chart';
import WordCloud from './WordCloud';
import SentimentSummary from './SentimentSummary';
import { fetchTrends } from '../api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTrends();
        if (result) setData(result);
        else setError('Failed to load data from API');
      } catch (err) {
        setError('API error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return <div className="text-center py-10 text-lg">⚙️ Loading awesome trends...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500 text-lg">❌ Error: {error}</div>;
  if (!data)
    return <div className="text-center py-10 text-lg">No data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen p-8 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-gray-100 text-gray-900'
      }`}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-wide mb-4 sm:mb-0">
          🌟 AI Product Trend Predictor
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-5 py-2 rounded-xl font-semibold transition transform hover:scale-105 ${
            darkMode
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-4 rounded-2xl shadow-md border border-white/20 text-center">
          <p className="text-sm opacity-70">🔥 Total Trends</p>
          <h3 className="text-2xl font-bold">{data.products?.length || 0}</h3>
        </div>
        <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-4 rounded-2xl shadow-md border border-white/20 text-center">
          <p className="text-sm opacity-70">💬 Avg Sentiment</p>
          <h3 className="text-2xl font-bold">{data.sentiment?.avg || 'N/A'}</h3>
        </div>
        <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-4 rounded-2xl shadow-md border border-white/20 text-center">
          <p className="text-sm opacity-70">🔑 Keywords</p>
          <h3 className="text-2xl font-bold">{data.wordCloudData?.length || 0}</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.forecasts && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-5 rounded-2xl shadow-lg border border-white/10"
          >
            <h2 className="text-xl font-semibold mb-3">📈 Forecast Trends</h2>
            <Chart data={data.forecasts} />
          </motion.div>
        )}

        {data.wordCloudData && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-5 rounded-2xl shadow-lg border border-white/10"
          >
            <h2 className="text-xl font-semibold mb-3">☁️ Keyword Cloud</h2>
            <WordCloud words={data.wordCloudData} />
          </motion.div>
        )}

        {data.sentiment && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-md bg-white/10 dark:bg-gray-800/40 p-5 rounded-2xl shadow-lg border border-white/10"
          >
            <h2 className="text-xl font-semibold mb-3">💡 Sentiment Overview</h2>
            <SentimentSummary sentiment={data.sentiment.avg} />
          </motion.div>
        )}
      </div>

      {/* Trending Products */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
          🚀 Trending Products
        </h2>
        {data.trending_products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.trending_products.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-5 rounded-2xl shadow-lg border backdrop-blur-md bg-green-100/40 border-green-400 text-green-900 dark:bg-green-900/30 dark:text-green-100"
              >
                <h3 className="font-bold text-lg mb-1">{item.product_name}</h3>
                <p className="text-sm mb-1">Score: {item.score}</p>
                <p className="text-sm mb-1">Confidence: {item.confidence}%</p>
                <p className="text-sm opacity-75">Status: {item.predicted_trend}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p>No trending products available</p>
        )}
      </section>

      {/* Non-Trending Products */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
          📉 Not Trending Products
        </h2>
        {data.non_trending_products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.non_trending_products.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-5 rounded-2xl shadow-lg border backdrop-blur-md bg-red-100/40 border-red-400 text-red-900 dark:bg-red-900/30 dark:text-red-100"
              >
                <h3 className="font-bold text-lg mb-1">{item.product_name}</h3>
                <p className="text-sm mb-1">Score: {item.score}</p>
                <p className="text-sm mb-1">Confidence: {item.confidence}%</p>
                <p className="text-sm opacity-75">Status: {item.predicted_trend}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p>No non-trending products available</p>
        )}
      </section>
    </motion.div>
  );
};

export default Dashboard;
