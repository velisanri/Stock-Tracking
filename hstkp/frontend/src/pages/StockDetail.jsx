import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { io } from 'socket.io-client';


import alarmSound from '../assets/sounds/alarm.mp3';
import setSound from '../assets/sounds/set.mp3';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, annotationPlugin);

const socket = io('http://localhost:5000');

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [livePrice, setLivePrice] = useState(null);
  const [alarmTarget, setAlarmTarget] = useState('');
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmId, setAlarmId] = useState(null);

  const userId = localStorage.getItem('userId');

  // Bildirim izni
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Fiyat geçmişi
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/stocks/history', { params: { symbol } });
        setHistory(res.data);
      } catch (err) {
        console.error('❌ Fiyat geçmişi alınamadı:', err);
      }
    }
    fetchHistory();
  }, [symbol]);

  // Kullanıcının alarmı
  useEffect(() => {
    async function fetchAlarm() {
      try {
        const res = await api.get('/alarms', { params: { userId } });
        const existing = res.data.find(a => a.symbol === symbol);
        if (existing) {
          setAlarmTarget(existing.targetPrice);
          setAlarmActive(true);
          setAlarmId(existing.id);
        }
      } catch (err) {
        console.error('❌ Alarm alınamadı:', err);
      }
    }
    if (userId) fetchAlarm();
  }, [symbol, userId]);

  // Canlı fiyat ve alarm tetikleme
  useEffect(() => {
    function handlePriceUpdate({ symbol: incomingSymbol, price }) {
      if (incomingSymbol !== symbol) return;

      setLivePrice(price);

      if (alarmActive && alarmTarget && price >= parseFloat(alarmTarget)) {
        
        if (Notification.permission === 'granted') {
          new Notification('Fiyat Alarmı', {
            body: `${symbol} ${alarmTarget}₺ fiyatına ulaştı!`,
            icon: '/icon.png'
          });
        }

        
        const audio = new Audio(alarmSound);
        audio.play();

        alert(`${symbol} ${alarmTarget}₺ fiyatına ulaştı! 🔔`);
        setAlarmActive(false);
        setAlarmTarget('');

        if (alarmId) {
          api.delete(`/alarms/${alarmId}`).catch(err => console.error('❌ Alarm silinemedi:', err));
        }
      }
    }

    socket.on('priceUpdate', handlePriceUpdate);
    return () => socket.off('priceUpdate', handlePriceUpdate);
  }, [symbol, alarmTarget, alarmActive, alarmId]);

  // Alarm kurma
  async function setAlarm(userId, symbol, targetPrice) {
    return await api.post('/alarms', {
      userId,
      symbol,
      targetPrice,
      direction: 'above'
    });
  }

  const handleSetAlarm = async () => {
    if (!alarmTarget || isNaN(alarmTarget)) {
      alert('Lütfen geçerli bir fiyat girin');
      return;
    }

    try {
      const res = await setAlarm(userId, symbol, parseFloat(alarmTarget));
      setAlarmActive(true);
      setAlarmId(res.data.id);

      const audio = new Audio(setSound);
      audio.play();

      alert(`${symbol} için ${alarmTarget}₺ alarmı başarıyla kuruldu ✅`);
    } catch (err) {
      console.error('❌ Alarm kurulamadı:', err);
      alert('Alarm kurulamadı');
    }
  };

  // Grafik ayarları
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      annotation: {
        annotations: alarmActive && alarmTarget
          ? {
              alarmLine: {
                type: 'line',
                yMin: parseFloat(alarmTarget),
                yMax: parseFloat(alarmTarget),
                borderColor: 'red',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: `Alarm: ${alarmTarget}₺`,
                  enabled: true,
                  position: 'start',
                  backgroundColor: 'rgba(255,0,0,0.7)',
                  color: 'white',
                  font: { weight: 'bold' }
                }
              }
            }
          : {}
      }
    }
  }), [alarmTarget, alarmActive]);

  const data = useMemo(() => ({
    labels: history.map(item => item.date),
    datasets: [
      {
        label: `${symbol} Fiyat Geçmişi`,
        data: history.map(item => item.price),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        tension: 0.3,
        pointRadius: 3
      }
    ]
  }), [history, symbol]);

  return (
    <div style={{ maxWidth: 700, margin: '50px auto' }}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: 20,
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        ← Dashboard'a Dön
      </button>

      <h2>{symbol} - Fiyat Grafiği</h2>

      {livePrice !== null && (
        <p style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>
          Anlık Fiyat: {livePrice.toFixed(2)}₺
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          placeholder="Alarm fiyatı (₺)"
          value={alarmTarget}
          onChange={e => setAlarmTarget(e.target.value)}
          style={{ padding: 6, width: '60%', marginRight: 10 }}
        />
        <button
          onClick={handleSetAlarm}
          style={{
            padding: 6,
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 4
          }}
        >
          Alarm Kur
        </button>
      </div>

      {history.length > 0 ? (
        <Line data={data} options={chartOptions} />
      ) : (
        <p>Grafik yükleniyor...</p>
      )}
    </div>
  );
}
