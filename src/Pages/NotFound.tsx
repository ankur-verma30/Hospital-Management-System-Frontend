import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6">
      <div className="text-center">
        <h1 className="text-[8rem] md:text-[10rem] font-extrabold leading-none drop-shadow-lg">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-white/80 max-w-md mx-auto mb-8">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
