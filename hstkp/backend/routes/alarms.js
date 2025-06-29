const express = require('express');
const router = express.Router();
const { Alarm } = require('../models');


router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId gerekli' });

  try {
    const alarms = await Alarm.findAll({ where: { userId } });
    res.json(alarms);
  } catch (err) {
    console.error('Alarm verileri alınamadı:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.post('/', async (req, res) => {
  const { userId, symbol, targetPrice, direction } = req.body;

  try {
    const alarm = await Alarm.create({ userId, symbol, targetPrice, direction });
    res.json(alarm);
  } catch (err) {
    console.error('❌ Alarm eklenemedi:', err);
    res.status(500).json({ error: 'Alarm eklenemedi' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Alarm.destroy({ where: { id } });
    res.json({ message: 'Alarm silindi' });
  } catch (err) {
    console.error('❌ Alarm silinemedi:', err);
    res.status(500).json({ error: 'Alarm silinemedi' });
  }
});

module.exports = router;
