import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-sky-200 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">
          Explore the World
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Have questions about your next adventure? Whether it's mountains, beaches, or hidden city gems, we're here to help you plan your perfect journey. Reach out and let's make your travel dreams come true!
        </p>
        <p className="text-gray-500 italic">
          ✈️ Travel far, explore wide, and create memories!
        </p>
      </div>
    </div>
  );
};

export default Contact;
