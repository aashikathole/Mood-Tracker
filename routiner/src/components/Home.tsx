import React from 'react';
import { Link } from 'react-router-dom';
import { Smile } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#cfbaf0] to-[#a3c4f3]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <Smile className="mx-auto h-12 w-auto text-[#f1c0e8]" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Routiner</h2>
          <p className="mt-2 text-sm text-gray-600">Track your mood, practice gratitude, and plan your day</p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#90dbf4] hover:bg-[#8eecf5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cfbaf0]">
              Login
            </Link>
          </div>
          <div>
            <Link to="/register" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#90dbf4] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cfbaf0]">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;