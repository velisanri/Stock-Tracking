import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import App from './App';

export default function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/login'); 
    }
  }, []);

  return <App />;
}
