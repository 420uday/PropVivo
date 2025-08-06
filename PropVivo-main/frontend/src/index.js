import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext'; // Optional theme context
import { TwilioProvider } from './context/TwilioContext'; // Optional Twilio context

// Error boundary for catching errors in app
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong.</h1>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TwilioProvider>
          <App />
        </TwilioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring
// In production, send to analytics endpoint
if (process.env.NODE_ENV === 'production') {
  reportWebVitals(metric => {
    analytics.send('web_vitals', metric);
  }, {
    reportAllChanges: true
  });
}

// In development, just log to console
else {
  reportWebVitals(console.log, {
    forceInDevelopment: true
  });
}