const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Yetkisiz: Token eksik' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Yetkisiz: Token formatı hatalı' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('Token doğrulama hatası:', err.message);
    return res.status(403).json({ error: 'Geçersiz token' });
  }
};
