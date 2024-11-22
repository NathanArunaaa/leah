import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from 'cheerio';  

const LinkPreview = ({ url }) => {
  const [metaData, setMetaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetaData = async () => {
    try {
      const response = await axios.get(url);
      const $ = load(response.data); 
      const title = $('meta[property="og:title"]').attr('content');
      const description = $('meta[property="og:description"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');

      setMetaData({ title, description, image });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Open Graph data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaData();
  }, [url]);

  return (
    <div className=" my-4 p-4 bg-white shadow-lg rounded-lg">
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : metaData ? (
        <div className="flex items-center space-x-4">
          {metaData.image && (
            <img
              src={metaData.image}
              alt={metaData.title}
              className="w-24 h-24 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{metaData.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{metaData.description}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm mt-2 inline-block hover:underline"
            >
              Open Link
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-600">More tips can be posted by users</div>
      )}
    </div>
  );
};

export default LinkPreview;
