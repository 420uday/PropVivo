import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7266/callHub")
    .withAutomaticReconnect()
    .build();

export const startSignalRConnection = async () => {
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  }
};

// Allows components to subscribe to events from the hub
export const onIncomingCall = (callback) => {
  connection.on("IncomingCall", (customerData) => {
    callback(customerData);
  });
};