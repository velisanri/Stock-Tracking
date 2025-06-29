const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Boş alan bırakılamaz' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı' });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed });

    return res.status(201).json({
      message: 'Kayıt başarılı',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre zorunludur' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz şifre' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, // userId olarak
      process.env.JWT_SECRET || 'gizli_anahtar',
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Başarıyla giriş yaptınız',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { register, login };
