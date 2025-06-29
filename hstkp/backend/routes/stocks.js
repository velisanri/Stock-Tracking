const express = require('express');
const router = express.Router();

const allStocks = [
  { symbol: 'AKBNK', name: 'Akbank' },
  { symbol: 'THYAO', name: 'Türk Hava Yolları' },
  { symbol: 'ASELS', name: 'Aselsan' },
  { symbol: 'SISE', name: 'Şişecam' },
  { symbol: 'KRDMD', name: 'Kardemir' }
];


router.get('/', (req, res) => {
  res.json(allStocks);
});


router.get('/history', (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol gerekli' });


  const history = [];
  let price = 70 + Math.random() * 10;

  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);


    const change = (Math.random() - 0.5) * 2;
    price = +(price + change).toFixed(2);

    history.push({
      date: date.toISOString().slice(0, 10), // yyyy-mm-dd
      price
    });
  }

  res.json(history);
});

module.exports = router;
