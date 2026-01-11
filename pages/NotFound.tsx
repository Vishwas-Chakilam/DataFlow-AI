import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => navigate(AppRoute.HOME)}
        className="mt-8 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
