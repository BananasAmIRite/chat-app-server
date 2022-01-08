import ChatServer from './Server';
import WebSocket from 'ws';

type EventType = 'message' | 'roomuseradd' | 'roomuserremove' | 'roomcreate' | 'roomremove';

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

  emitEvent(type: EventType, payload: any, filter: (id: IDType, ws: WebSocket) => boolean = () => true) {
    const correctlyFilteredWs = new Map([...this.sockets].filter(([k, v]) => filter(k, v)));

    for (const socket of correctlyFilteredWs.values()) {
      socket.send(JSON.stringify({ type, payload }));
    }
  }

  removeSocket(id: IDType) {
    return this.websockets.delete(id);
  }

  get sockets() {
    return this.websockets;
  }
}
