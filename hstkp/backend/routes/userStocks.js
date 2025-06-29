const express = require('express');
const router = express.Router();
const UserStock = require('../models/UserStock');
const auth = require('../middleware/auth'); 

const allStocks = [
  { symbol: 'AKBNK', name: 'Akbank' },
  { symbol: 'THYAO', name: 'Türk Hava Yolları' },
  { symbol: 'ASELS', name: 'Aselsan' },
  { symbol: 'SISE', name: 'Şişecam' },
  { symbol: 'KRDMD', name: 'Kardemir' }
];


router.post('/', auth, async (req, res) => {
  const userId = req.user.userId;
  const { selected } = req.body;

  if (!Array.isArray(selected)) {
    return res.status(400).json({ error: 'Geçersiz veri' });
  }

  try {
    await UserStock.destroy({ where: { userId } });
    const records = selected.map(symbol => ({ userId, symbol }));
    await UserStock.bulkCreate(records);

    return res.json({ message: 'Takip listesi güncellendi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.get('/', auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const stocks = await UserStock.findAll({ where: { userId } });
    const symbols = stocks.map(stock => stock.symbol);
    res.json(symbols);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.get('/details', auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const selected = await UserStock.findAll({ where: { userId } });
    const symbols = selected.map(s => s.symbol);
    const filtered = allStocks.filter(stock => symbols.includes(stock.symbol));
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.delete('/', auth, async (req, res) => {
  const userId = req.user.userId;
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Sembol gerekli' });
  }

  try {
    await UserStock.destroy({ where: { userId, symbol } });
    res.json({ message: 'Takipten çıkarıldı' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
