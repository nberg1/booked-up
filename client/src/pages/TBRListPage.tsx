// src/pages/TBRListPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TBRList, { UserBook } from '../components/TBRList';

const TBRListPage: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token') || ''; // assume token is stored in localStorage

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My TBR List</h2>
      <TBRList initialBooks={books} token={token} />
    </div>
  );
};

export default TBRListPage;
