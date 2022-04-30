import ChatRoom from '../entities/ChatRoom.entity';
import Message from '../entities/Message.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function removeRoom(server: ChatServer, room: number | ChatRoom, userId: number) {
  const normalizedRoom =
    typeof room === 'number'
      ? await ChatRoom.findOne({
          where: {
            id: room,
          },
          relations: ['owner'],
        })
      : room;

  if (!normalizedRoom) throw new Error(`Invalid room. `);
  if (normalizedRoom?.owner.id !== userId) throw new Error('No permission');

  await normalizedRoom?.softRemove();

  // no events emitted for room creation
  const memo: number[] = [];

  for (const user of normalizedRoom.users) {
    memo.push(user.id);
  }

  server.eventSockets.emitEvent('server:remove', { id: normalizedRoom.id }, memo);
}
