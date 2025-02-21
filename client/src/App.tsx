import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TBRListPage from './pages/TBRListPage';
import GoogleBooksTestPage from './pages/GoogleBooksTestPage';

const App: React.FC = () => {
  return (
    <Router>
      <header style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h1>Booked Up</h1>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
            <li>
              <Link to="/">TBR List</Link>
            </li>
            <li>
              <Link to="/google-books">Google Books Test</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<TBRListPage />} />
          <Route path="/google-books" element={<GoogleBooksTestPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
