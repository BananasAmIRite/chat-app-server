import ChatServer from './Server';
import Utils from './utils/utils';
import { WebSocket } from 'ws';

export default class EventSocketManager<IDType = string> {
  // will have all the event websockets stored
  private websockets: Map<IDType, WebSocket>;
  constructor(private server: ChatServer) {
    this.websockets = new Map();
  }

  addSocket(id: IDType, ws: WebSocket) {
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
