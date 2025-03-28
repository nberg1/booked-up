import React, { useState } from 'react';
import TBRListPage from './TBRListPage';
import FinishedBooksPage from './FinishedBooksPage';

enum Tab {
  TBR = 'TBR',
  Finished = 'Finished',
}

const BooksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TBR);

  return (
    <div className="min-h-screen bg-bookTan">
      <div className="max-w-4xl mx-auto">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab(Tab.TBR)}
            className={`flex-1 py-2 text-center ${
              activeTab === Tab.TBR ? 'border-b-4 border-bookAccent font-bold' : 'text-bookBrown'
            }`}
          >
            TBR List
          </button>
          <button
            onClick={() => setActiveTab(Tab.Finished)}
            className={`flex-1 py-2 text-center ${
              activeTab === Tab.Finished ? 'border-b-4 border-bookAccent font-bold' : 'text-bookBrown'
            }`}
          >
            Finished Books
          </button>
        </div>
        <div>
          {activeTab === Tab.TBR ? <TBRListPage /> : <FinishedBooksPage />}
        </div>
      </div>
    </div>
  );
};

export default BooksSection;
