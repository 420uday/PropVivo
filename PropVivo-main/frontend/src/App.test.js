import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import TwilioService from './services/twilioService';

// Mock the TwilioService
jest.mock('./services/twilioService', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    answerCall: jest.fn(),
    endCall: jest.fn(),
    device: {
      on: jest.fn(),
      destroy: jest.fn()
    }
  }
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ token: 'test-token' }),
    ok: true
  })
);

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders initialization message when loading', () => {
    render(<App />);
    const loadingElement = screen.getByText(/Initializing call system/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('initializes Twilio service on mount', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/twilio/token');
      expect(TwilioService.initialize).toHaveBeenCalledWith('test-token');
    });
  });

  test('displays waiting message when initialized', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Waiting for incoming calls/i)).toBeInTheDocument();
    });
  });

  test('handles incoming call notification', async () => {
    // Mock an incoming call
    const mockCall = {
      parameters: {
        From: '+1234567890'
      }
    };
    
    // Setup Twilio mock
    TwilioService.device.on.mockImplementation((event, callback) => {
      if (event === 'incoming') {
        callback(mockCall);
      }
    });
    
    // Mock customer fetch response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          name: 'John Doe',
          phoneNumber: '+1234567890',
          email: 'john@example.com'
        }),
        ok: true
      })
    );
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Incoming Call/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Answer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Decline/i })).toBeInTheDocument();
    });
  });

  test('handles call answer', async () => {
    // Mock an incoming call
    const mockCall = {
      parameters: {
        From: '+1234567890'
      },
      accept: jest.fn()
    };
    
    TwilioService.device.on.mockImplementation((event, callback) => {
      if (event === 'incoming') {
        callback(mockCall);
      }
    });
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          name: 'John Doe',
          phoneNumber: '+1234567890'
        }),
        ok: true
      })
    );
    
    render(<App />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Answer/i }));
      expect(TwilioService.answerCall).toHaveBeenCalled();
    });
  });

  test('handles call decline', async () => {
    // Mock an incoming call
    const mockCall = {
      parameters: {
        From: '+1234567890'
      }
    };
    
    TwilioService.device.on.mockImplementation((event, callback) => {
      if (event === 'incoming') {
        callback(mockCall);
      }
    });
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          name: 'John Doe',
          phoneNumber: '+1234567890'
        }),
        ok: true
      })
    );
    
    render(<App />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Decline/i }));
      expect(TwilioService.endCall).toHaveBeenCalled();
    });
  });
});