import { Router } from 'express';
import Utils from '../../../utils/utils';
import User from '../../../entities/User.entity';
import ChatRoom from '../../../entities/ChatRoom.entity';

const ChatroomDeleteRouter = Router({
  mergeParams: true,
});

ChatroomDeleteRouter.post<{ roomId: string }>('/', async (req, res) => {
  /*
  params: {
    name: string, 
    owners: User
    users: User[]
  }
  */
  // returns boolean

  const userId = req.server.tokens.getIDByToken(req.authToken || '');

  if (!userId) return Utils.error(res, `Invalid user. `, 401);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });

  if (!user) return Utils.error(res, `Invalid user. `, 401);

  try {
    const room = req.room!;

    if (room.owner.id !== user.id) return Utils.error(res, `No access. `, 403);

    await room.softRemove();

    Utils.success(res, true);
  } catch (err) {
    console.log(err);
    return Utils.error(res, `Unknown error. `, 500);
  }
});

export default ChatroomDeleteRouter;
