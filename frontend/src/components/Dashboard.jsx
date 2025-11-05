import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import WordCloud from 'react-d3-cloud';
import { useTheme } from '../context/ThemeContext';
import { fetchTrends } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchTrends();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute border-8 border-blue-200 rounded-full w-full h-full"></div>
          <div className="absolute border-8 border-blue-600 rounded-full w-full h-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data?.forecasts?.map(f => f.date) || [],
    datasets: [{
      label: 'Trend Forecast',
      data: data?.forecasts?.map(f => f.value) || [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Trend Forecast'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold mb-8 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          AI Product Trend Predictor
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Predictions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-xl p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Product Predictions
            </h2>
            <div className="space-y-3">
              {Object.entries(data?.predictions || {}).map(([product, trend]) => (
                <motion.div
                  key={product}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`font-medium truncate ${
                    darkMode ? 'text-gray-100' : 'text-gray-700'
                  }`}>
                    {product}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    trend === 'Trending' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trend}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sentiment Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow ${
              darkMode ? 'bg-gray-800' : ''
            }`}
          >
            <h2 className={`text-lg font-semibold text-gray-700 mb-4 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Sentiment Analysis
            </h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">
                  {(data?.sentiment?.avg * 100).toFixed(0)}%
                </div>
                <div className="text-gray-500 mt-2">Positive Sentiment</div>
              </div>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:col-span-2 hover:shadow-2xl transition-shadow"
          >
            <Line data={chartData} options={chartOptions} className="h-[400px]" />
          </motion.div>

          {/* Word Cloud */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:col-span-2 hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Keyword Analysis</h2>
            <div className="h-[300px] flex justify-center items-center">
              <WordCloud
                data={data?.wordCloudData || []}
                width={800}
                height={300}
                font="Inter"
                fontWeight="bold"
                fontSize={(word) => Math.log2(word.value) * 5}
                spiral="rectangular"
                rotate={0}
                padding={5}
                random={() => 0.5}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;