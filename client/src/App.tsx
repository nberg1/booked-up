import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TBRListPage from './pages/TBRListPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import GoogleBooksTestPage from './pages/GoogleBooksTestPage';

const App: React.FC = () => {
  return (
    <Router>
      <header className="p-4 bg-gray-100">
        <h1 className="text-3xl font-bold">Booked Up</h1>
        <nav>
          <ul className="flex gap-4 list-none mt-2">
            <li>
              <Link to="/" className="text-blue-500 hover:underline">TBR List</Link>
            </li>
            <li>
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </li>
            <li>
              <Link to="/google-books" className="text-blue-500 hover:underline">Google Books Test</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<TBRListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/google-books" element={<GoogleBooksTestPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
