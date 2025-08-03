import React, { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';
import { startSignalRConnection, onIncomingCall } from './signalRService';
import apiClient, { setAuthToken } from './apiClient';
import './App.css';

function App() {
  const [uiState, setUiState] = useState('initializing');
  const [customer, setCustomer] = useState(null);
  const [textToSay, setTextToSay] = useState('');
  
  const deviceRef = useRef(null);
  const activeConnectionRef = useRef(null);

  const handleStartSystem = async (event) => {
    event.currentTarget.disabled = true;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const authResponse = await apiClient.get('/Authentication/generate-token');
      setAuthToken(authResponse.data.token);

      const twilioTokenResponse = await apiClient.get('/v1/voice/token');
      const twilioToken = twilioTokenResponse.data.token;

      const device = new Device(twilioToken, {
        edge: ['ashburn', 'singapore'],
      });
      deviceRef.current = device;

      device.on('error', (error) => {
        console.error('Twilio Device Error:', error.message);
        setUiState('error');
      });

      device.on('incoming', (connection) => {
        console.log('Twilio: Incoming connection object received.');
        activeConnectionRef.current = connection;
      });
      
      device.on('disconnect', () => {
        console.log("Call disconnected via Twilio event.");
        handleHangUp();
      });

      await device.register();
      setUiState('ready');

    } catch (error) {
      console.error("Initialization failed:", error);
      setUiState('error');
    }
  };

  useEffect(() => {
    startSignalRConnection();
    onIncomingCall((customerData) => {
      console.log("SignalR: Received incoming call data for:", customerData.name);
      setCustomer(customerData);
      setUiState('ringing');
    });

    return () => {
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, []);

  const handleAnswer = () => {
    if (activeConnectionRef.current) {
      console.log("Answering call...");
      activeConnectionRef.current.accept();
      setUiState('active');
    } else {
      console.error("Cannot answer: No active Twilio connection object is stored.");
    }
  };

  const handleHangUp = () => {
    if (deviceRef.current) {
      deviceRef.current.disconnectAll();
    }
    setUiState('ready');
    setCustomer(null);
    activeConnectionRef.current = null;
  };

  const handleSayText = async () => {
    if (!textToSay.trim()) return;

    try {
      const response = await apiClient.post('/v1/modulation/say', JSON.stringify(textToSay), {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob',
      });
      
      const audio = new Audio(URL.createObjectURL(response.data));
      audio.play();
      setTextToSay('');
    } catch (error) {
      console.error('Error converting text to speech:', error);
      alert('Failed to generate speech.');
    }
  };
  
  const renderContent = () => {
    switch (uiState) {
      case 'ringing':
        return (
          <div className="call-notification">
            <h2>Incoming Call...</h2>
            {customer && <p>From: {customer.name} ({customer.phoneNumber})</p>}
            <div className="call-controls">
              <button className="btn answer-btn" onClick={handleAnswer}>Answer</button>
              <button className="btn decline-btn" onClick={handleHangUp}>Decline</button>
            </div>
          </div>
        );
      case 'active':
        return (
          <div className="customer-details">
            <h2>Customer Information</h2>
            {customer && (
              <>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Address:</strong> {customer.address}</p>
                <p><strong>Notes:</strong> {customer.notes}</p>
              </>
            )}

            <div className="modulation-controls" style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px', textAlign: 'center' }}>
              <h4>Voice Modulation (Say in American Accent)</h4>
              <input 
                type="text" 
                value={textToSay} 
                onChange={(e) => setTextToSay(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSayText()}
                placeholder="Type message to say..."
                style={{ width: 'calc(70% - 10px)', padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: '#fff' }}
              />
              <button className="btn answer-btn" onClick={handleSayText}>Say</button>
            </div>

            <div className="call-controls">
                <button className="btn hangup-btn" onClick={handleHangUp}>Hang Up</button>
            </div>
          </div>
        );
      case 'ready':
        return (
          <div className="waiting-message">
            <p>Waiting for incoming calls...</p>
          </div>
        );
      case 'error':
        return <div className="waiting-message"><p>Error: Could not initialize. Please refresh and allow microphone access.</p></div>;
      case 'initializing':
      default:
        return (
          <div className="init-button-container">
            <p>Click the button to initialize the call system and connect.</p>
            <button className="btn answer-btn" onClick={handleStartSystem}>
              Start Call System
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Support Dashboard</h1>
      </header>
      <main className="dashboard">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;