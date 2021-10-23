import ChatRoom from './entities/ChatRoom.entity';
import Message from './entities/Message.entity';
import User from './entities/User.entity';
import ChatServer from './Server';

export default class MessageManager {
  // make this send a message in a chatroom, and itll notify all users etc. etc.
  constructor(private server: ChatServer) {}

  async send(chatroom: string | ChatRoom, user: string | User, message: string) {
    const normalizedChatroom =
      typeof chatroom === 'string'
        ? await ChatRoom.findOne({
            where: {
              id: chatroom,
            },
            relations: ['users'],
          })
        : chatroom;

    const normalizedUser =
      typeof user === 'string'
        ? await User.findOne({
            where: {
              id: user,
            },
          })
        : user;

    if (!normalizedChatroom) throw new Error(`Invalid chatroom. `);
    if (!user) throw new Error(`Invalid user. `);

    const msg = Message.create({
      chatRoom: normalizedChatroom,
      content: message,
      user: normalizedUser,
    });
    await msg.save();

    const chatRoomUserMemo = [];

    for (const user of normalizedChatroom.users) {
      chatRoomUserMemo.push(user.id);
    }

    for (const [k, v] of this.server.eventSockets.sockets.entries()) {
      if (chatRoomUserMemo.includes(k)) v.send(JSON.stringify({ type: 'message', payload: msg.toWebJson() }));
    }
  }
}
