import ChatRoom from '../entities/ChatRoom.entity';
import Message from '../entities/Message.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';

export default async function removeRoom(server: ChatServer, room: string | ChatRoom) {
  const normalizedRoom =
    typeof room === 'string'
      ? await ChatRoom.findOne({
          where: {
            id: room,
          },
        })
      : room;

  if (!normalizedRoom) throw new Error(`Invalid room. `);

  await normalizedRoom?.softRemove();

  // no events emitted for room creation
  const memo: number[] = [];

  for (const user of normalizedRoom.users) {
    memo.push(user.id);
  }

  server.eventSockets.emitEvent('roomremove', normalizedRoom.toWebJson(), (id) => memo.includes(id));
}
