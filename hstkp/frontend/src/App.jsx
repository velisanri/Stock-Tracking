import Register from './components/Register';
import Login from './components/Login';
import StockSelect from './components/StockSelect';
import Dashboard from './components/Dashboard';
import StockDetail from './pages/StockDetail';
import Settings from './pages/Settings';
import HisseTakip from './pages/HisseTakip';
import Profile from './pages/Profile';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stocks" element={<StockSelect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks/:symbol" element={<StockDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/takip" element={<HisseTakip />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <ToastContainer />
      </>
    </Router>
  );
}

export default App;
