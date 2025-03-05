import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TBRListPage from './pages/TBRListPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import GoogleBooksTestPage from './pages/GoogleBooksTestPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FinishedBooksPage from './pages/FinishedBooksPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header /> {/* Persistent header with search bar */}
        <main className="bg-bookBeige text-bookBrown">
          <Routes>
            <Route path="/" element={<TBRListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<CreateAccountPage />} />
            <Route path="/google-books" element={<GoogleBooksTestPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/finished" element={<FinishedBooksPage />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
