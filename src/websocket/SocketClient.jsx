class SocketClient {
  socket = null;

  connect(url, onMessage) {
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  send(payload) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const socketClient = new SocketClient();
