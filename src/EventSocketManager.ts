import ChatServer from './Server';
import * as ws from 'ws';

export default class EventSocketManager<IDType = string> {
  // will have all the event websockets stored
  private websockets: Map<IDType, ws>;
  constructor(private server: ChatServer) {
    this.websockets = new Map();
  }

  addSocket(id: IDType, ws: ws) {
    ws.on('close', () => {
      this.removeSocket(id);
    });
    this.websockets.set(id, ws);
    return id;
  }

  removeSocket(id: IDType) {
    return this.websockets.delete(id);
  }

  get sockets() {
    return this.websockets;
  }
}
