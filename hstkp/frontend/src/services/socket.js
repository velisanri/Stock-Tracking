import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000'); // port backend'in portuna uygun olsun
