import ChatRoom from '../entities/ChatRoom.entity';
import User from '../entities/User.entity';
import ChatServer from '../Server';
// TODO: client -> server events to listen for:
//  client:userAdd
//  client:create
//  client:remove
//  client:userRemove
//  client:sendMessage

// TODO: server -> client events to listen for:
//  server:userAdd        EventTypes.USER_ADD
//  server:create         EventTypes.ROOM_ADD
//  server:remove         EventTypes.ROOM_REMOVE
//  server:userRemove     EventTypes.USER_REMOVE
//  server:sendMessage    EventTypes.MESSAGE

export default async function addRoomUser(
  server: ChatServer,
  room: number | ChatRoom,
  user: string | User,
  owner: number
) {
  const normalizedUser =
    typeof user === 'string'
      ? await User.findOne({
          where: {
            user,
          },
        })
      : user;

  const normalizedRoom =
    typeof room === 'number'
      ? await ChatRoom.findOne({
          where: {
            id: room,
          },
          relations: ['owner', 'users'],
        })
      : room;

  if (!normalizedUser) throw new Error('User not found');
  if (!normalizedRoom || !normalizedRoom.users) throw new Error('Room not found');
  if (normalizedRoom.owner.id !== owner) throw new Error('No permission');
  if (normalizedRoom.users.find((e) => e.id === normalizedUser.id) !== undefined)
    throw new Error('User already in the chatroom');
  const memo: number[] = [];

  for (const user of normalizedRoom.users) {
    memo.push(user.id);
  }
  memo.push(normalizedUser.id);

  normalizedRoom.users.push(normalizedUser);

  await normalizedRoom.save();

  server.eventSockets.emitEvent(
    'server:userAdd',
    {
      roomId: normalizedRoom.id,
      users: normalizedRoom.toWebJson().users,
    },
    memo
  );
}
// TODO: implement server side part of this later
