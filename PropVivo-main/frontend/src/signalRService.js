import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7266/callHub")
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 1s, 2s, 4s, 8s, then 10s max
          return Math.min(
            Math.pow(2, retryContext.previousRetryCount) * 1000,
            10000
          );
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.subscriptions = new Map();
    this.setupConnectionEvents();
  }

  setupConnectionEvents() {
    this.connection.onclose(async (error) => {
      console.warn("SignalR connection closed", error);
      await this.tryReconnect();
    });

    this.connection.onreconnecting((error) => {
      console.warn("SignalR reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected. New connection ID:", connectionId);
    });
  }

  async startConnection() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("SignalR Connected. Connection ID:", this.connection.connectionId);
        return true;
      } catch (err) {
        console.error("SignalR Connection Error:", err);
        await this.tryReconnect();
        return false;
      }
    }
    return false;
  }

  async tryReconnect() {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.startConnection();
    } catch (err) {
      console.error("Reconnection failed:", err);
    }
  }

  subscribe(eventName, callback) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, []);
      this.connection.on(eventName, (...args) => {
        this.subscriptions.get(eventName).forEach(cb => cb(...args));
      });
    }
    this.subscriptions.get(eventName).push(callback);
    return () => this.unsubscribe(eventName, callback);
  }

  unsubscribe(eventName, callback) {
    const callbacks = this.subscriptions.get(eventName) || [];
    this.subscriptions.set(
      eventName,
      callbacks.filter(cb => cb !== callback)
    );
  }

  async invoke(methodName, ...args) {
    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (err) {
      console.error(`Error invoking ${methodName}:`, err);
      throw err;
    }
  }
}

// Singleton instance
const signalRService = new SignalRService();

// Export commonly used methods directly
export const startSignalRConnection = () => signalRService.startConnection();
export const onIncomingCall = (callback) => 
  signalRService.subscribe("IncomingCall", callback);
export const invokeHubMethod = signalRService.invoke.bind(signalRService);

// Export the full service for advanced usage
export default signalRService;