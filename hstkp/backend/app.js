const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const userStockRoutes = require('./routes/userStocks');


const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/user/stocks', userStockRoutes);


sequelize.sync().then(() => {
  console.log("Database connected.");
  app.listen(5000, () => console.log("Server started on port 5000"));
});
