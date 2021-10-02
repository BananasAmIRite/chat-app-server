import { Router } from 'express';
import Utils from '../../../utils/utils';
import User from '../../../entities/User.entity';
import ChatRoom from '../../../entities/ChatRoom.entity';

const ChatroomDeleteRouter = Router({
  mergeParams: true,
});

ChatroomDeleteRouter.post('/', async (req, res) => {
  /*
  params: {
    name: string, 
    owners: User
    users: User[]
  }
  */
  // returns {roomId: string}

  // ------------
  // ---- these things should never happen ----
  const userId = req.server.tokens.getIDByToken(req.authToken || '');
  // @ts-ignore <-- specified in chatroom.router.ts
  const crId = parseInt(req.params.roomId as string);

  if (!userId) return Utils.error(res, `Invalid user. `, 401);
  if (!crId) return Utils.error(res, `Invalid chatroom. `, 400);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });

  if (!user) return Utils.error(res, `Invalid user. `, 401);

  try {
    const chatRoom = await ChatRoom.findOne({
      where: {
        id: crId,
      },
    });

    if (!chatRoom) return Utils.error(res, `No such room. `, 404);

    if (chatRoom.owner.id !== user.id) return Utils.error(res, `No access. `, 403);

    Utils.success(res, true);
  } catch (err) {
    console.log(err);
    return Utils.error(res, `Unknown error. `, 400);
  }
});

export default ChatroomDeleteRouter;
