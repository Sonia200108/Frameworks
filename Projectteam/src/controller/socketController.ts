import { WebSocket, WebSocketServer } from "ws";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

class SocketController {
  private wss!: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor() {
    try {
      this.wss = new WebSocketServer({ port: 3001, path: "/socket" });

      this.wss.on("connection", (ws: WebSocket) => {
        console.log("'WebSocket connection established");
        this.clients.add(ws);

        this.sendProductCount(ws);

        ws.on("close", () => {
          console.log("WebSocket connection closed");
          this.clients.delete(ws);
        });
      });

      setInterval(this.sendProductCountToAll.bind(this), 5000);
    } catch (error) {
      console.error("Error starting the WebSocket server:", error);
    }
  }

  private async sendProductCount(ws: WebSocket) {
    const productCount = await AppDataSource.getRepository(Product).count();
    ws.send(`Product count: ${productCount}`);
    const repo = AppDataSource.getRepository(Product);
    const products = await repo.find();
    console.log("Products in DB:", products);
  }

  private async sendProductCountToAll() {
    const productCount = await AppDataSource.getRepository(Product).count();
    this.clients.forEach((client) => {
      client.send(`Products: ${productCount}`);
    });
  }
}

export default SocketController;