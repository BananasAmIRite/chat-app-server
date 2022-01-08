import ChatRoom from '../entities/ChatRoom.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function createRoom(
  server: ChatServer,
  owner: string | User,
  roomName: string
): Promise<ChatRoom> {
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

  server.eventSockets.emitEvent('roomcreate', room.toWebJson().users, (id) => normalizedOwner.id === id);

  return room;
}
