// components/ChatBot.js
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup, Card, ListGroup } from 'react-bootstrap';
import './ChatBot.css';

const ChatBot = ({ showChat, setShowChat }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        id: messages.length + 2,
        text: "Hello! 👋 I'm here to help you with your shopping needs. You can ask me about products, categories, or assistance!",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('product') || message.includes('item')) {
      return {
        id: messages.length + 2,
        text: "We have a wide range of products! Check out our Best Sellers, Top Selling items, or New Arrivals sections. What type of product are you looking for?",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
      return {
        id: messages.length + 2,
        text: "Our prices are competitive! 💰 You can find great deals in different categories. Check out our current promotions and discounts!",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('delivery') || message.includes('shipping') || message.includes('arrive')) {
      return {
        id: messages.length + 2,
        text: "We offer fast delivery! 🚚 Standard shipping takes 3-5 days, express shipping available. Free shipping on orders over $50!",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('return') || message.includes('refund') || message.includes('exchange')) {
      return {
        id: messages.length + 2,
        text: "We have a 30-day return policy! 🔄 Items must be in original condition. Contact our support team for return assistance.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return {
        id: messages.length + 2,
        text: "I'm here to help! 🤝 For specific issues, you can also contact our customer support at support@shop.com or call (555) 123-4567.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        id: messages.length + 2,
        text: "You're welcome! 😊 Is there anything else I can help you with today?",
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Default response
    const defaultResponses = [
      "I'm here to assist with your shopping needs! You can ask me about products, delivery, returns, or general help.",
      "That's interesting! How can I help you with your shopping experience today?",
      "I'm your shopping assistant! Feel free to ask about our products, categories, or any other shopping-related questions.",
      "Let me help you find what you're looking for! What specific information would you like to know?"
    ];
    
    return {
      id: messages.length + 2,
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="shopbot-container">
      {/* Chat Button */}
      <Button 
        variant="danger"
        className={`shopbot-toggle-btn ${showChat ? 'shopbot-active' : ''}`}
        onClick={toggleChat}
      >
        <i className={`fas ${showChat ? 'fa-times' : 'fa-robot'}`}></i>
        <span className="shopbot-pulse"></span>
      </Button>

      {/* Chat Window */}
      {showChat && (
        <Card className="shopbot-window">
          <Card.Header className="shopbot-header">
            <div className="d-flex align-items-center">
              <div className="shopbot-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="ms-2">
                <h6 className="mb-0">Shopping Assistant</h6>
                <small className="text-muted">
                  {isTyping ? 'Typing...' : 'Online'}
                </small>
              </div>
            </div>
            <Button 
              variant="link" 
              className="shopbot-close p-0"
              onClick={toggleChat}
            >
              <i className="fas fa-times"></i>
            </Button>
          </Card.Header>

          <Card.Body className="shopbot-body">
            <div className="shopbot-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`shopbot-msg ${message.sender === 'user' ? 'shopbot-msg-user' : 'shopbot-msg-bot'}`}
                >
                  <div className="shopbot-msg-content">
                    <div className="shopbot-msg-text">{message.text}</div>
                    <div className="shopbot-msg-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="shopbot-msg shopbot-msg-bot">
                  <div className="shopbot-msg-content">
                    <div className="shopbot-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </Card.Body>

          <Card.Footer className="shopbot-footer">
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="shopbot-input w-50"
                />
                <Button 
                //   variant="primary" 
                  variant='success'
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="shopbot-send"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </InputGroup>
            </Form>
            {/* <div className="shopbot-quick mt-2">
              <small className="text-muted">Quick questions:</small>
              <div className="d-flex flex-wrap gap-1">
                {['Products?', 'Delivery?', 'Returns?', 'Help?'].map((action) => (
                  <Button
                    key={action}
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setInputMessage(action)}
                    className="shopbot-quick-btn"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div> */}
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;