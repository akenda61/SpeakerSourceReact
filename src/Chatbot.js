import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchThreadId = async () => {
      try {
        const response = await fetch('http://16.170.157.71/start');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setThreadId(data.thread_id);
      } catch (error) {
        console.error('Failed to fetch thread_id:', error);
      }
    };
    fetchThreadId();
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = userInput.trim();
    if (!userMessage) return;

    // Update sender label to 'you' for the user's messages
    setMessages([...messages, { text: userMessage, sender: 'you' }]);
    setUserInput('');
    setIsLoading(true);
    const serverResponse = await sendMessageToServer(userMessage);
    setIsLoading(false);

    // Update sender label to 'bot' for the bot's messages
    setMessages(prevMessages => [...prevMessages, { text: serverResponse, sender: 'bot' }]);
    
  };

  const sendMessageToServer = async (message) => {
    try {
      const response = await fetch('http://16.170.157.71/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, thread_id: threadId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData.response;

    } catch (error) {
      console.error('Failed to send message:', error);
      return 'Error: Could not get a response';
    }
  };


  const formatMessage = (message) => {
    // Splitting the message by line breaks and wrapping each line in a span
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line.split('**').reduce((prev, current, i) => i % 2 === 0 ? [...prev, current] : [...prev, <strong key={i}>{current}</strong>], [])}
        {index < message.split('\n').length - 1 && <br />}
      </span>
    ));
  };


  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index} className={`message ${msg.sender === 'you' ? 'sender-you' : 'sender-bot'}`}>
            <strong>{msg.sender === 'you' ? 'You' : 'SpeakerSource'}: </strong>
            {formatMessage(msg.text)}
          </p>
        ))}
        {isLoading && <p className="loading-message">Loading...</p>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input type="text" value={userInput} onChange={handleInputChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );


};

export default Chatbot;