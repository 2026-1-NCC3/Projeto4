import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import UploadVideo from './components/uploadVideoTeste';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/UploadVideo" element={<UploadVideo />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
