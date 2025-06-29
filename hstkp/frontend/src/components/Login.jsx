import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);

      setSuccess(res.data.message);
      setForm({ email: '', password: '' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f2f2f2',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: 30,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          marginBottom: 20,
          textAlign: 'center',
          color: '#333'
        }}>
          🔐 Giriş Yap
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-posta"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 15,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 15
            }}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 20,
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 15
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              backgroundColor: '#007bff',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Giriş Yap
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
          Hesabınız yok mu?{' '}
          <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
            Kayıt Ol
          </Link>
        </p>

        {error && (
          <div style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: 6,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: 6,
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
