import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import BooksSection from './pages/BooksSection';

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/books/*" element={<BooksSection />} />
          <Route path="/" element={<BooksSection />} />
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
