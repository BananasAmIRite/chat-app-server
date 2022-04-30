import ChatServer from './Server';
import WebSocket from 'ws';
import { Server, Socket } from 'socket.io';

// TODO: server -> client events to listen for:
//  server:userAdd        EventTypes.USER_ADD
//  server:create         EventTypes.ROOM_ADD
//  server:remove         EventTypes.ROOM_REMOVE
//  server:userRemove     EventTypes.USER_REMOVE
//  server:sendMessage    EventTypes.MESSAGE

type EventType = 'server:userAdd' | 'server:userRemove' | 'server:create' | 'server:remove' | 'server:sendMessage';

export default class EventSocketManager<IDType = string> {
  // will have all the event websockets stored
  private socketToUserMap: Map<IDType, string[]>;
  constructor(private io: Server) {
    this.socketToUserMap = new Map();
  }

  addSocket(id: IDType, socket: Socket) {
    socket.on('disconnect', () => {
      this.removeSocket(socket.id);
    });
    this.addSocketToUser(id, socket);
    return id;
  }

  private addSocketToUser(id: IDType, socket: Socket) {
    if (this.socketToUserMap.has(id)) {
      return this.socketToUserMap.get(id)?.push(socket.id);
    } else {
      this.socketToUserMap.set(id, [socket.id]);
    }
  }

  // where would I set up the websocket listeners
  //

  async emitEvent(type: EventType, payload: any, users: IDType[]) {
    // const correctlyFilteredWs = new Map([...this.sockets].filter(([k, v]) => filter(k, v)));
    // for (const socket of correctlyFilteredWs.values()) {
    //   socket.send(JSON.stringify({ type, payload }));
    // }
    for (const userId of users) {
      for (const userConnectionId of this.socketToUserMap.get(userId) || []) {
        this.io.sockets.sockets.get(userConnectionId)?.emit(type, payload);
      }
    }
  }

  removeSocket(id: string) {
    for (let [k, v] of this.socketToUserMap) {
      if (v.includes(id)) {
        v.splice(v.indexOf(id), 1);
        return true;
      }
    }
    return false;
  }

  getUserIdBySocket(socket: Socket): IDType | undefined {
    const id = socket.id;
    for (let [k, v] of this.socketToUserMap) {
      if (v.includes(id)) return k;
    }
    return;
  }
}
