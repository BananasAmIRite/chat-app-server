import ChatRoom from '../entities/ChatRoom.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function addRoomUser(server: ChatServer, room: string | ChatRoom, user: number | User) {
  const normalizedUser =
    typeof user === 'number'
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

  if (!normalizedUser || !normalizedRoom || !normalizedRoom.users) return;

  const memo: number[] = [];

  for (const user of normalizedRoom.users) {
    memo.push(user.id);
  }
  memo.push(normalizedUser.id);

  normalizedRoom.users.push(normalizedUser);

  await normalizedRoom.save();

  server.eventSockets.emitEvent('roomuseradd', normalizedRoom.toWebJson().users, (id) => memo.includes(id));
}
