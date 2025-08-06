import React, { useState, useEffect, useRef } from 'react';
import TwilioService from './services/twilioService';
import CallNotification from './components/CallNotification';
import CustomerInfo from './components/CustomerInfo';
import CallControls from './components/CallControls';
import './styles.css';

function App() {
  const [incomingCall, setIncomingCall] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [textToSay, setTextToSay] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Twilio service when component mounts
    const initializeTwilio = async () => {
      try {
        // Fetch Twilio token from backend (in a real app, this would be secured)
        const response = await fetch('/api/twilio/token');
        const data = await response.json();
        
        TwilioService.initialize(data.token);
        setIsInitialized(true);
        
        // Listen for incoming calls
        TwilioService.device.on('incoming', call => {
          setIncomingCall(call);
          
          // Look up customer by phone number
          const phoneNumber = call.parameters.From;
          fetchCustomer(phoneNumber);
        });

      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initializeTwilio();

    return () => {
      // Clean up Twilio device when component unmounts
      if (TwilioService.device) {
        TwilioService.device.destroy();
      }
    };
  }, []);

  const fetchCustomer = async (phoneNumber) => {
    try {
      const response = await fetch(`/api/call/customer/${phoneNumber}`);
      const customerData = await response.json();
      setCustomer(customerData);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleAnswer = () => {
    TwilioService.answerCall();
    setCallActive(true);
    setIncomingCall(null);
  };

  const handleEnd = () => {
    TwilioService.endCall();
    setCallActive(false);
    setCustomer(null);
  };

  const handleSayText = async () => {
    if (!textToSay.trim()) return;

    try {
      const response = await fetch('/api/call/say', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSay })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        setTextToSay('');
      } else {
        console.error('Error converting text to speech');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="app-container">
        <div className="init-message">
          <p>Initializing call system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {incomingCall && (
        <CallNotification 
          caller={customer?.name || incomingCall.parameters.From}
          onAnswer={handleAnswer}
          onReject={handleEnd}
        />
      )}
      
      {callActive && customer && (
        <div className="call-container">
          <CustomerInfo customer={customer} />
          
          <div className="modulation-controls">
            <h4>Voice Modulation (Say in American Accent)</h4>
            <input 
              type="text" 
              value={textToSay} 
              onChange={(e) => setTextToSay(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSayText()}
              placeholder="Type message to say..."
            />
            <button onClick={handleSayText}>Say</button>
          </div>
          
          <CallControls onEnd={handleEnd} />
        </div>
      )}

      {!incomingCall && !callActive && (
        <div className="waiting-message">
          <p>Waiting for incoming calls...</p>
        </div>
      )}
    </div>
  );
}

export default App;