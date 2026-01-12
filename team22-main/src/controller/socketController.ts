import { WebSocket, WebSocketServer } from 'ws';
import { AppDataSource } from '../data-source';
import { Child } from '../entity/Child';

class SocketController {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor() {
    try {
      this.wss = new WebSocketServer({ port: 3001, path: '/socket' });

      this.wss.on('connection', (ws: WebSocket) => {
        console.log('WebSocket connection established');
        this.clients.add(ws);

        // Send the initial child count
        this.sendChildCount(ws);

        ws.on('close', () => {
          console.log('WebSocket connection closed');
          this.clients.delete(ws);
        });
      });

      // Set up interval to check the database and send updates to all clients
      setInterval(this.sendChildCountToAll.bind(this), 5000); // Check the database every 5 seconds
    } catch (error) {
      console.error('Error starting the WebSocket server:', error);
    }
  }

  private async sendChildCount(ws: WebSocket) {
    const childCount = await AppDataSource.getRepository(Child).count();
    ws.send(`Child count: ${childCount}`);
  }

  private sendChildCountToAll = async () => {
    const childCount = await AppDataSource.getRepository(Child).count();
    this.clients.forEach((client) => {
      client.send(`Child count: ${childCount}`);
    });
  };
}

export default SocketController;