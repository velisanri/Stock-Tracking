import { useState } from 'react';
import api from '../services/api';

export default function AlarmModal({ stockId, userId, onClose }) {
  const [price, setPrice] = useState('');
  const [direction, setDirection] = useState('above');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/alarms', {
        price: parseFloat(price),
        direction,
        userId,
        stockId,
      });
      setMessage('✅ Alarm başarıyla kuruldu.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setMessage('❌ Alarm kurulamadı.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.content}>
        <h3>Alarm Kur</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>Fiyat: </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Yön: </label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="above">Üzerine çıkarsa</option>
              <option value="below">Altına düşerse</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Alarm Kur'}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>
            Kapat
          </button>
        </form>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  content: {
    background: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300
  }
};
