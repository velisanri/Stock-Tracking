const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
require('dotenv').config();



const stockRoutes = require('./routes/stocks');
const userStockRoutes = require('./routes/userStocks');
const authRoutes = require('./routes/auth');
const alarmRoutes = require('./routes/alarms');
const userRoutes = require('./routes/user');



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});


app.use(cors());
app.use(express.json());


app.use('/api/stocks', stockRoutes);
app.use('/api/user/stocks', userStockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alarms', alarmRoutes);
app.use('/api/user', userRoutes);




const symbols = ['AKBNK', 'THYAO', 'ASELS', 'SISE', 'KRDMD'];
let prices = {};
symbols.forEach(sym => prices[sym] = Math.random() * 100);

setInterval(() => {
  symbols.forEach(symbol => {
    const change = (Math.random() - 0.5) * 2;
    prices[symbol] = +(prices[symbol] + change).toFixed(2);
    io.emit('priceUpdate', { symbol, price: prices[symbol] });
  });
}, 5000);


sequelize.sync({ force: false }).then(() => {
  console.log('Veritabanı senkronize edildi.');
});


const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
