import logo from './logo.svg';
import './App.css';

import React from 'react';
import Chatbot from './Chatbot';

function App() {
  return (
      <div>
          <div className="top-banner">
              <div className="banner-title">SpeakerSource</div>
              <button className="login-button">Log In</button>
          </div>
          <Chatbot />
      </div>
  );
}

export default App;
