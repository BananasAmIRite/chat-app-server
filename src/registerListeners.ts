import { Server, Socket } from 'socket.io';
import addRoomUser from './actions/addRoomUser';
import createRoom from './actions/createRoom';
import removeRoom from './actions/removeRoom';
import removeRoomUser from './actions/removeRoomUser';
import sendMessage from './actions/sendMessage';
import { verifySocketCredentials } from './middlewares/VerifyCredentials';
import ChatServer from './Server';
import { Descendant } from 'slate';
import { EventEmitter } from 'events';
import { Acknowledgment } from './types/interfaces';

// TODO: client -> server events to listen for:
//  client:userAdd
//  client:create
//  client:remove
//  client:userRemove
//  client:sendMessage

export default function registerListeners(server: ChatServer, io: Server) {
  io.use((socket, next) => {
    const info = verifySocketCredentials(socket);
    if (!info || !info[0] || !info[1]) return socket.disconnect();

    server.eventSockets.addSocket(info[0], socket);

    next();
  }).on('connection', (socket) => {
    const socketUser = server.eventSockets.getUserIdBySocket(socket);
    if (!socketUser) throw new Error('Incorrectly registered socket. ');

    socket
      .on(
        'client:userAdd',
        async ({ roomId, userId }: { roomId: number; userId: string }, callback: Acknowledgment) => {
          handleError(async () => await addRoomUser(server, roomId, userId, socketUser), callback);
        }
      )
      .on('client:create', ({ roomName }: { roomName: string }, callback: Acknowledgment) => {
        handleError(async () => createRoom(server, socketUser, roomName), callback);
      })
      .on('client:remove', ({ roomId }: { roomId: number }, callback: Acknowledgment) => {
        handleError(async () => removeRoom(server, roomId, socketUser), callback);
      })
      .on('client:userRemove', ({ roomId, userId }: { roomId: number; userId: number }, callback: Acknowledgment) => {
        handleError(async () => removeRoomUser(server, roomId, userId, socketUser), callback);
      })
      .on(
        'client:sendMessage',
        ({ roomId, message }: { roomId: number; message: Descendant[] }, callback: Acknowledgment) => {
          handleError(async () => sendMessage(server, roomId, socketUser, message), callback);
        }
      );

    // // @ts-ignore
    // socket[Symbol.for('nodejs.rejection')] = (err: Error) => {
    //   console.log(err);
    //   socket.emit('error', err.message);
    // };

    // TODO: question: is there any way to error handle statements inside each `on` statement here without going through each and using try catch?
  });
}

const handleError = async (f: () => any, cb: Acknowledgment) => {
  try {
    await f();
    cb<true>({ success: true, response: null });
  } catch (err: any) {
    console.log(err);

    cb<false>({ success: false, error: err.message });
  }
};
