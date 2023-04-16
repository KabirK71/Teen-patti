import React from 'react';
import logo from './logo.svg';
import HomePage from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { io } from 'socket.io-client';
import LoadingPage from './components/LoadingPage/LoadingPage';
import GamePage from './components/GamePage/GamePage';
const socket = io('http://localhost:3001', { transports: ['websocket'] });
socket.connect();

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/loadingPage" element={<LoadingPage socket={socket} />} />
          <Route path="/gamePage" element={<GamePage socket={socket} />} />
          {/* <Route path="/" element={<GamePage socket={socket} />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
