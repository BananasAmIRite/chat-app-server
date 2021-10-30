import ChatRoom from '../entities/ChatRoom.entity';
import Message from '../entities/Message.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function removeRoom(server: ChatServer, user: string | User, room: string | ChatRoom) {
  const normalizedUser =
    typeof user === 'string'
      ? await User.findOne({
          where: {
            id: user,
          },
        })
      : user;

  const normalizedRoom =
    typeof room === 'string'
      ? await ChatRoom.findOne({
          where: {
            id: room,
          },
        })
      : room;

  await normalizedRoom?.softRemove();

  // no events emitted for room creation
  //   const chatRoomUserMemo = [];

  //   for (const user of normalizedChatroom.users) {
  //     chatRoomUserMemo.push(user.id);
  //   }

  //   server.eventSockets.emitEvent('message', msg.toWebJson(), (id) => chatRoomUserMemo.includes(id));
}
