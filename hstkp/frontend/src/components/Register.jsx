import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordStrong = (pw) => pw.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      return setError("Lütfen tüm alanları doldurun.");
    }

    if (!isEmailValid(form.email)) {
      return setError("Geçersiz e-posta formatı.");
    }

    if (!isPasswordStrong(form.password)) {
      return setError("Şifre en az 6 karakter olmalı.");
    }

    try {
      const res = await api.post('/auth/register', form);
      setSuccess("🎉 Tebrikler! Başarıyla kaydoldunuz.");
      setForm({ name: '', email: '', password: '' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Bir hata oluştu');
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
          📝 Kayıt Ol
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Adınız"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            placeholder="Şifre (en az 6 karakter)"
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
              backgroundColor: '#28a745',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Kayıt Ol
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
            Giriş Yap
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
