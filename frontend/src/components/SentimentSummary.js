import React from 'react';

const SentimentSummary = ({ sentiment }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Sentiment Summary</h3>
      <p className="text-lg">Average Sentiment: <span className={`font-bold ${sentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>{sentiment.toFixed(2)}</span></p>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(sentiment + 1) * 50}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SentimentSummary;