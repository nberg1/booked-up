import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TBRListPage from './pages/TBRListPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FinishedBooksPage from './pages/FinishedBooksPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header /> {/* Persistent header with search bar */}
      <main className="bg-bookBeige text-bookBrown">
        <Routes>
          <Route path="/" element={<TBRListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/finished" element={<FinishedBooksPage />} />
        </Routes>
      </main>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
