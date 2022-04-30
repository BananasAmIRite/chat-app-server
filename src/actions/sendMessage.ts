import ChatRoom from '../entities/ChatRoom.entity';
import Message from '../entities/Message.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function sendMessage(
  server: ChatServer,
  chatroom: number | ChatRoom,
  user: number | User,
  message: string
) {
  const normalizedChatroom =
    typeof chatroom === 'number'
      ? await ChatRoom.findOne({
          where: {
            id: chatroom,
          },
          relations: ['users'],
        })
      : chatroom;

  const normalizedUser =
    typeof user === 'number'
      ? await User.findOne({
          where: {
            id: user,
          },
        })
      : user;

  if (!normalizedChatroom) throw new Error('Invalid chatroom');

  // if (!normalizedChatroom) throw new Error(`Invalid chatroom. `);
  // if (!normalizedUser) throw new Error(`Invalid user. `);

  const msg = Message.create({
    chatRoom: normalizedChatroom,
    content: message,
    user: normalizedUser,
  });
  await msg.save();

  const chatRoomUserMemo: number[] = [];

  for (const user of normalizedChatroom?.users || []) {
    chatRoomUserMemo.push(user.id);
  }

  server.eventSockets.emitEvent(
    'server:sendMessage',
    {
      roomId: normalizedChatroom.id,
      message: msg.toWebJson(),
    },
    chatRoomUserMemo
  );
}
