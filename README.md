# 📈 Stock Tracking Desktop Application

A modern desktop application built with **Electron**, **React**, and **Node.js (Express)** allowing users to monitor selected stocks in real-time, set price alarms, and manage their portfolio preferences.

-> **Install Dependencies**:

Start the Backend Server:

1-cd hstkp

2-cd backend

3-npm install

4-node server.js


Start the Electron Frontend:

1-cd hstkp

2-cd frontend 

3-npm install                 

4-npm run build

5-npm run start


-> **Start the Project**:

cd backend            node server.js

cd frontend           npm run start

-> **Tech Stack & Libraries**:

Frontend: React, Vite

Backend: Node.js, Express.js , Sequelize, Socket.io 

Database: SQLite (via Sequelize ORM)

Desktop: Electron


-> **Features**:

User authentication system including registration and login functionality.

Real-time stock price updates via WebSocket integration.

Ability to set custom price alerts for followed stocks.

Audio and visual notifications when alert thresholds are reached.

Stock follow/unfollow management for personalized tracking.

Interactive line chart showing historical stock prices with annotation for alerts.

User profile screen including email display and password change functionality.

Responsive and user-friendly design optimized for desktop.

Electron integration for cross-platform desktop application support.

Secure backend with JWT-based authentication and password hashing using bcrypt.



-> **Major Libraries**:

react-router-dom	Page navigation (routing)

axios API requests

sequelize	ORM for SQLite

bcrypt	Password hashing

jsonwebtoken	Token-based authentication

socket.io	Real-time communication

chart.js + react-chartjs-2	Line charts for stock prices

chartjs-plugin-annotation	Alarm line on chart

sweetalert2	User-friendly alert dialogs

react-toastify	Toast notifications

electron	Desktop app framework



