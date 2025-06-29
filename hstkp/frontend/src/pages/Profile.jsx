import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      // Kullanıcı email bilgisi alınır
      api.get(`/user/${userId}`).then(res => {
        setEmail(res.data.email);
      }).catch(() => {
        setEmail('Bilinmiyor');
      });
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış yapmak istiyor musunuz?',
      text: 'Oturumunuz sonlandırılacak.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        toast.success('Başarıyla çıkış yapıldı ');
        navigate('/login');
      }
    });
  };

  const evaluateStrength = (pw) => {
    if (pw.length < 6) return 'Çok Zayıf';
    if (!/[A-Z]/.test(pw)) return 'Zayıf';
    if (!/[0-9]/.test(pw)) return 'Orta';
    if (!/[!@#$%^&*]/.test(pw)) return 'Güçlü';
    return 'Çok Güçlü';
  };

  const strengthColor = {
    'Çok Zayıf': 'darkred',
    'Zayıf': 'orangered',
    'Orta': 'orange',
    'Güçlü': 'green',
    'Çok Güçlü': 'darkgreen'
  };

  const handleSubmit = async () => {
  setMessage('');
  setError('');

  // yeni şifre mevcutla aynı olamaz
  if (currentPassword === newPassword) {
    setError('Yeni şifre, mevcut şifreyle aynı olamaz.');
    return;
  }

  try {
    const res = await api.post('/user/change-password', {
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setMessage(res.data.message);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength('');

    setTimeout(() => {
      localStorage.removeItem('userId');
      navigate('/login');
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.error || 'Bir hata oluştu.');
  }
};

  return (
    <div style={{
      maxWidth: 500,
      margin: '50px auto',
      backgroundColor: '#fff',
      padding: 30,
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          ⬅️ Ana Ekrana Dön
        </Link>
        <button onClick={handleLogout} style={{
          color: 'red', border: 'none', background: 'none',
          cursor: 'pointer', fontWeight: 'bold'
        }}>
          🚪 Çıkış Yap
        </button>
      </div>

      <h2 style={{ marginBottom: 20 }}>👤 Profil</h2>

      <label style={{ fontWeight: 'bold', marginBottom: 4 }}>E-posta Adresi:</label>
      <input
        type="email"
        value={email}
        readOnly
        style={{
          backgroundColor: '#e9ecef',
          width: '100%',
          padding: 10,
          borderRadius: 6,
          border: '1px solid #ccc',
          marginBottom: 20
        }}
      />

      <h4 style={{ marginTop: 20 }}>🔒 Şifre Değiştir</h4>

      <input
        type={showCurrent ? 'text' : 'password'}
        placeholder="Mevcut Şifre"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 12 }}
      />
      <button onClick={() => setShowCurrent(prev => !prev)} style={{ marginBottom: 12 }}>
        {showCurrent ? '🙈 Gizle' : '👁️ Göster'}
      </button>

      <input
        type={showNew ? 'text' : 'password'}
        placeholder="Yeni Şifre"
        value={newPassword}
        onChange={e => {
          setNewPassword(e.target.value);
          setPasswordStrength(evaluateStrength(e.target.value));
        }}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 6 }}
      />
      <button onClick={() => setShowNew(prev => !prev)} style={{ marginBottom: 12 }}>
        {showNew ? 'Gizle' : 'Göster'}
      </button>

      {newPassword && (
        <div style={{ marginBottom: 12, fontWeight: 'bold', color: strengthColor[passwordStrength] }}>
          Güç: {passwordStrength}
        </div>
      )}

      <input
        type={showConfirm ? 'text' : 'password'}
        placeholder="Yeni Şifre (Tekrar)"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 12 }}
      />
      <button onClick={() => setShowConfirm(prev => !prev)} style={{ marginBottom: 20 }}>
        {showConfirm ? 'Gizle' : 'Göster'}
      </button>

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        Şifreyi Güncelle
      </button>

      {message && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: 10,
          marginTop: 20,
          borderRadius: 6,
          border: '1px solid #c3e6cb'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: 10,
          marginTop: 20,
          borderRadius: 6,
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
