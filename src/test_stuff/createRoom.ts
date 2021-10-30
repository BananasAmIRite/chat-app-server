import ChatRoom from '../entities/ChatRoom.entity';
import Message from '../entities/Message.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function createRoom(server: ChatServer, owner: string | User, roomName: string) {
  const normalizedOwner =
    typeof owner === 'string'
      ? await User.findOne({
          where: {
            id: owner,
          },
          relations: ['chatrooms'],
        })
      : owner;

  if (!normalizedOwner) throw new Error(`Invalid user. `);

  const room = ChatRoom.create({
    name: roomName,
    owner: normalizedOwner,
    users: [],
    messages: [],
  });

  room.users.push(normalizedOwner);
  await room.save();

  // no events emitted for room creation
  //   const chatRoomUserMemo = [];

  //   for (const user of normalizedChatroom.users) {
  //     chatRoomUserMemo.push(user.id);
  //   }

  //   server.eventSockets.emitEvent('message', msg.toWebJson(), (id) => chatRoomUserMemo.includes(id));
}
