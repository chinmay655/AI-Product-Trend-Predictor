import React from 'react';

const WordCloud = ({ words }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Trending Product Keywords</h3>
      <div className="flex flex-wrap justify-center">
        {words.map((word, index) => (
          <span
            key={index}
            className="m-1 p-2 bg-blue-200 rounded"
            style={{ fontSize: `${Math.max(12, word.value / 5)}px` }}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;