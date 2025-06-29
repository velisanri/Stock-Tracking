const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');


router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword, confirmPassword } = req.body;

  if (!userId || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Yeni şifreler uyuşmuyor' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mevcut şifre hatalı' });

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) return res.status(400).json({ error: 'Yeni şifre, mevcut şifreyle aynı olamaz' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (err) {
    console.error('Şifre değiştirilemedi:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'email'] // sadece id ve email alanı gelsin
    });

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Kullanıcı bilgisi alınamadı:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


module.exports = router;
