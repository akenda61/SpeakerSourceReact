import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Fetch thread_id when the component mounts
  useEffect(() => {
    const fetchThreadId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:80/start');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setThreadId(data.thread_id); // Assuming the response has a 'thread_id' field
      } catch (error) {
        console.error('Failed to fetch thread_id:', error);
      }
    };

    fetchThreadId();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = userInput.trim();
    if (!userMessage) return;

    // Add the user message to the chat
    setMessages([...messages, { text: userMessage, sender: 'user' }]);

    // Send the message to an external server and wait for the response
    const response = await sendMessageToServer(userMessage);

    // Add the server response to the chat
    setMessages((prevMessages) => [...prevMessages, { text: response, sender: 'bot' }]);
    setUserInput(''); // Clear input field
  };

  // Function to send a message to the server and get the response
  const sendMessageToServer = async (message) => {
    try {
      const response = await fetch('http://127.0.0.1:80/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, threadId: threadId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData.reply; // Assuming the response has a 'reply' field
    } catch (error) {
      console.error('Failed to send message:', error);
      return 'Error: Could not get a response';
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right' }}>
            {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={userInput} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;

