import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Settings() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Oturum kontrolü
  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  // Verileri al
  useEffect(() => {
    async function fetchData() {
      try {
        const [stockRes, userRes, alarmRes] = await Promise.all([
          api.get('/stocks'),
          api.get('/user/stocks', { params: { userId } }),
          api.get('/alarms', { params: { userId } })
        ]);
        setStocks(stockRes.data);
        setSelected(userRes.data);
        setAlarms(alarmRes.data);
      } catch (err) {
        console.error('❌ Ayar verileri alınamadı', err.response?.data || err.message);
      }
    }
    if (userId) fetchData();
  }, [userId]);

  // Checkbox işlemi
  const toggle = (symbol) => {
    setSelected(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  //  Kaydet
  const handleSave = async () => {
    try {
      await api.post('/user/stocks', { userId, selected });
      toast.success('✅ Takip listeniz güncellendi!', { autoClose: 2000 });
    } catch (err) {
      console.error('❌ Güncelleme hatası:', err);
      toast.error('Takip güncellenemedi ❌');
    }
  };

  // Alarm silme
  const removeAlarm = async (id) => {
    const confirm = await Swal.fire({
      title: 'Alarm silinsin mi?',
      text: 'Bu işlem geri alınamaz!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal'
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/alarms/${id}`);
        setAlarms(prev => prev.filter(a => a.id !== id));
        toast.success('🔕 Alarm silindi');
      } catch (err) {
        console.error('❌ Alarm silinemedi:', err);
        toast.error('❌ Alarm silinemedi');
      }
    }
  };

  //  Çıkış
  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış yapmak istiyor musunuz?',
      text: 'Oturumunuz kapatılacak.',
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
        toast.success('👋 Çıkış yapıldı');
        navigate('/login');
      }
    });
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: '50px auto',
      backgroundColor: '#fff',
      padding: 30,
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* ÜST MENÜ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <Link to="/dashboard" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
          ⬅️ Ana Ekrana Dön
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/profile" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
            👤 Profil
          </Link>
          <button onClick={handleLogout} style={{
            color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold'
          }}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: 24, marginBottom: 20 }}>⚙️ Ayarlar</h2>

      {/*  Hisse Seçimi */}
      <h4 style={{ marginBottom: 10 }}>📈 Takip Edilen Hisseler</h4>

      {stocks.length === 0 ? (
        <p style={{ color: '#6c757d' }}>⏳ Hisse verileri yükleniyor...</p>
      ) : selected.length === 0 ? (
        <div style={{
          padding: 20, backgroundColor: '#f8f9fa', border: '1px dashed #ccc',
          borderRadius: 8, color: '#6c757d', marginBottom: 20
        }}>
          📉 Henüz hiç hisse seçmediniz. Aşağıdan hisseleri seçebilirsiniz.
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {stocks.map(s => (
          <label key={s.symbol} style={{
            background: selected.includes(s.symbol) ? '#d1e7dd' : '#f8f9fa',
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={selected.includes(s.symbol)}
              onChange={() => toggle(s.symbol)}
              style={{ marginRight: 10 }}
            />
            {s.name} ({s.symbol})
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 16px',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 16
        }}
      >
        💾 Kaydet
      </button>

      {/*  Alarm Listesi */}
      <h4 style={{ marginTop: 40, marginBottom: 10 }}>🔔 Alarm Listesi</h4>
      {alarms.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 30,
          backgroundColor: '#f8f9fa',
          border: '1px dashed #ccc',
          borderRadius: 8,
          color: '#6c757d'
        }}>
          <p style={{ fontSize: 20, marginBottom: 10 }}>🔕 Kurulu bir alarmınız yok</p>
          <p>
            <Link to="/dashboard" style={{ color: '#007bff', fontWeight: 'bold' }}>
              Alarm kurmak için hisse detayına gidebilirsiniz
            </Link>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alarms.map(alarm => (
            <div key={alarm.id} style={{
              backgroundColor: '#fff3cd',
              padding: 12,
              border: '1px solid #ffeeba',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>
                {alarm.symbol}: {alarm.targetPrice}₺
              </span>
              <button
                onClick={() => removeAlarm(alarm.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
