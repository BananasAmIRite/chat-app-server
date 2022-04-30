import ChatRoom from '../entities/ChatRoom.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function removeRoomUser(
  server: ChatServer,
  room: number | ChatRoom,
  user: number | User,
  ownerUser: number
) {
  const normalizedUser =
    typeof user === 'number'
      ? await User.findOne({
          where: {
            id: user,
          },
        })
      : user;

  const normalizedRoom =
    typeof room === 'number'
      ? await ChatRoom.findOne({
          where: {
            id: room,
          },
          relations: ['owner'],
        })
      : room;

  if (!normalizedUser || !normalizedRoom || !normalizedRoom.users) throw new Error('User or room not found');
  if (normalizedRoom?.owner.id !== ownerUser) throw new Error('No permission');

  const e = normalizedRoom.users.findIndex((e) => e.id === normalizedUser.id);

  if (e === -1) return;

  const memo: number[] = [];

  for (const user of normalizedRoom.users) {
    memo.push(user.id);
  }

  normalizedRoom.users.splice(e, 1);

  await normalizedRoom.save();

  server.eventSockets.emitEvent(
    'server:userRemove',
    {
      roomId: normalizedRoom.id,
      users: normalizedRoom.toWebJson().users,
    },
    memo
  );
}
