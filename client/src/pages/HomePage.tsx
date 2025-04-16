import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bookBeige p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-bookBrown">Welcome to Booked Up!</h1>
      <p className="text-lg mb-6 max-w-xl text-center text-bookBrown">
        Tired of letting your to-be-read books pile up? Bogged down with all the choices in your TBR and need to read all the summaries as a reminder? Booked Up is the fun and intuitive way to manage your TBR list. Jump in and explore all your upcoming reading adventures!
      </p>
      <div className="w-full max-w-md">
        {/* If the image is in your public folder, the source can be '/homepage.jpg' */}
        <img 
          src="/Booked-Up-Homepage-Image.jfif" 
          alt="Books and cozy reading corner" 
          className="rounded-lg shadow-lg" 
        />
      </div>
    </div>
  );
};

export default HomePage;