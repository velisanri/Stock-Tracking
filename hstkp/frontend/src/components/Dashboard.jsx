import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import LogoutButton from './LogoutButton';
import api from '../services/api';

const socket = io('http://localhost:5000');

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [alarms, setAlarms] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Bildirim izni
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Kullanıcının takip ettiği hisseleri getir
  useEffect(() => {
    async function fetchUserStocks() {
      try {
        const res = await api.get('/user/stocks/details', { params: { userId } });
        setStocks(res.data);
      } catch (err) {
        console.error('❌ Hisse bilgileri alınamadı', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchUserStocks();
  }, [userId]);

  // Canlı fiyat dinleme
  useEffect(() => {
    socket.on('priceUpdate', ({ symbol, price }) => {
      setPrices(prev => {
        const oldPrice = prev[symbol];
        setPriceChanges(pc => ({
          ...pc,
          [symbol]: oldPrice === undefined ? 'none' : price > oldPrice ? 'up' : price < oldPrice ? 'down' : 'none'
        }));

        const target = alarms[symbol];
        if (target && price >= target) {
          if (Notification.permission === 'granted') {
            new Notification('Fiyat Alarmı', {
              body: `${symbol} ${target}₺ fiyatına ulaştı!`,
              icon: '/icon.png'
            });
          }

          const audio = new Audio('/sounds/alarm.mp3');
          audio.play();

          const updated = { ...alarms };
          delete updated[symbol];
          setAlarms(updated);
        }

        return { ...prev, [symbol]: price };
      });
    });

    return () => socket.off('priceUpdate');
  }, [alarms]);

  // Takibi bırak
  const handleUnfollow = async (symbol) => {
    const confirm = await Swal.fire({
      title: `${symbol} takibinden çıkılsın mı?`,
      text: 'Bu hisseyi artık takip etmeyeceksiniz.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete('/user/stocks', { data: { userId, symbol } });
        setStocks(prev => prev.filter(s => s.symbol !== symbol));
        toast.success(`${symbol} takibinden çıkarıldı 🔕`);
      } catch (err) {
        console.error('❌ Takibi bırakma hatası:', err);
        toast.error('Bir hata oluştu.');
      }
    }
  };

  const handleAlarmRedirect = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  const handleGraphView = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: '50px auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
      }}>
        <LogoutButton />
        <Link to="/settings" style={{
          textDecoration: 'none',
          color: '#007bff',
          fontWeight: 'bold'
        }}>
          ⚙️ Ayarlara Git
        </Link>
      </div>

      <h2 style={{ marginBottom: 20 }}>📈 Takip Ettiğiniz Hisseler</h2>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: 18 }}>⏳ Yükleniyor...</p>
      ) : stocks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
          <p style={{ fontSize: 22 }}>📉 Henüz hiç hisse seçmediniz</p>
          <p>
            <Link to="/settings" style={{ color: '#007bff', fontWeight: 'bold' }}>
              Ayarlar sayfasından hisse seçebilirsiniz
            </Link>
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          {stocks.map(stock => {
            const price = prices[stock.symbol];
            const change = priceChanges[stock.symbol];
            const color = change === 'up' ? 'green' : change === 'down' ? 'red' : '#333';
            const arrow = change === 'up' ? '📈' : change === 'down' ? '📉' : '➖';

            return (
              <div
                key={stock.symbol}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: 10,
                  padding: 20,
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10
                }}
              >
                <div>
                  <Link to={`/stocks/${stock.symbol}`} style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#212529'
                  }}>
                    {stock.name} ({stock.symbol})
                  </Link>
                  <p style={{
                    marginTop: 8,
                    fontSize: 24,
                    color,
                    fontWeight: 'bold'
                  }}>
                    {price !== undefined ? `${price.toFixed(2)}₺ ${arrow}` : 'Fiyat alınıyor...'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleUnfollow(stock.symbol)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Takibi Bırak
                  </button>
                  <button
                    onClick={() => handleAlarmRedirect(stock.symbol)}
                    style={{
                      backgroundColor: '#fd7e14',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    🔔 Alarm Kur
                  </button>
                  <button
                    onClick={() => handleGraphView(stock.symbol)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    📊 Grafiği Gör
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
