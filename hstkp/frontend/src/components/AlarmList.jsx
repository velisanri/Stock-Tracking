import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AlarmList() {
  const [alarms, setAlarms] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchAlarms() {
      try {
        const res = await api.get('/alarms', {
          params: { userId }
        });
        setAlarms(res.data);
      } catch (err) {
        console.error('❌ Alarm listesi alınamadı', err);
      }
    }

    if (userId) fetchAlarms();
  }, [userId]);

  const deleteAlarm = async (id) => {
    try {
      await api.delete(`/alarms/${id}`);
      setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    } catch (err) {
      console.error('❌ Alarm silinemedi', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '30px auto' }}>
      <h3>Kurulu Alarmlar 🔔</h3>
      {alarms.length === 0 ? (
        <p>Herhangi bir alarm bulunmuyor.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {alarms.map(alarm => (
            <li key={alarm.id} style={{
              padding: 10,
              marginBottom: 8,
              border: '1px solid #ccc',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                {alarm.symbol} → <strong>{alarm.targetPrice}₺</strong>
              </span>
              <button
                onClick={() => deleteAlarm(alarm.id)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
