import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function StockSelect() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = 1; 


  useEffect(() => {
    async function fetchStocksAndSelections() {
      try {
        // Tüm hisseleri al
        const stockRes = await api.get('/stocks');
        setStocks(stockRes.data);

        // Kullanıcının daha önce seçtiği hisseleri al
        const selectedRes = await api.get('/user/stocks', {
          params: { userId }
        });

        setSelected(selectedRes.data); // örn: ['AKBNK', 'SISE']
      } catch (err) {
        console.error(err);
        setMessage('Veriler alınamadı.');
      }
    }

    fetchStocksAndSelections();
  }, []);

  // Seçimi güncelle
  const toggleSelection = (symbol) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Kaydet ve devam et
  const handleSubmit = async () => {
    try {
      const res = await api.post('/user/stocks', {
        userId,
        selected,
      });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage('Seçim kaydedilemedi.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, background: '#fff' }}>
      <h2>Takip Etmek İstediğiniz Hisseleri Seçin</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {stocks.map((stock) => (
          <li key={stock.symbol} style={{ marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(stock.symbol)}
                onChange={() => toggleSelection(stock.symbol)}
              />
              {' '} {stock.name} ({stock.symbol})
            </label>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        style={{ marginTop: 20, padding: 10, backgroundColor: '#007bff', color: '#fff' }}
      >
        Kaydet ve Devam Et
      </button>

      {message && <p style={{ marginTop: 10, color: 'green' }}>{message}</p>}
    </div>
  );
}
