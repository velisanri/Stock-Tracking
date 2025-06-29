import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';


console.log("HisseTakip sayfası yüklendi");


const HisseTakip = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    socket.on('priceUpdate', ({ symbol, price }) => {
      setPrices(prev => ({ ...prev, [symbol]: price }));
    });

    return () => {
      socket.off('priceUpdate');
    };
  }, []);

  const takipEdilenler = ['AKBNK', 'THYAO', 'ASELS']; 

  return (
    <div>
      <h2>📈 Canlı Hisse Fiyatları</h2>
      <ul>
        {takipEdilenler.map(symbol => (
          <li key={symbol}>
            {symbol}: {prices[symbol] ? `${prices[symbol]} ₺` : 'Yükleniyor...'}
          </li>
        ))}
      </ul>
    </div>
  );
};



export default HisseTakip;
