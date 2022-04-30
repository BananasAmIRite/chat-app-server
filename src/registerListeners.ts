import { Server, Socket } from 'socket.io';
import addRoomUser from './actions/addRoomUser';
import createRoom from './actions/createRoom';
import removeRoom from './actions/removeRoom';
import removeRoomUser from './actions/removeRoomUser';
import sendMessage from './actions/sendMessage';
import { verifySocketCredentials } from './middlewares/VerifyCredentials';
import ChatServer from './Server';

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
      .on('client:userAdd', ({ roomId, userId }: { roomId: number; userId: number }) => {
        addRoomUser(server, roomId, userId, socketUser);
      })
      .on('client:create', ({ roomName }: { roomName: string }) => {
        createRoom(server, socketUser, roomName);
      })
      .on('client:remove', ({ roomId }: { roomId: number }) => {
        removeRoom(server, roomId, socketUser);
      })
      .on('client:userRemove', ({ roomId, userId }: { roomId: number; userId: number }) => {
        removeRoomUser(server, roomId, userId, socketUser);
      })
      .on('client:sendMessage', ({ roomId, message }: { roomId: number; message: string }) => {
        sendMessage(server, roomId, socketUser, message);
      }); // TODO: question: is there any way to error handle statements inside on statements here?
  });
}
