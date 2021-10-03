import { Router } from 'express';
import Utils from '../../../utils/utils';
import User from '../../../entities/User.entity';
import ChatRoom from '../../../entities/ChatRoom.entity';

const ChatroomCreateRouter = Router();

ChatroomCreateRouter.post('/', async (req, res) => {
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

  if (!userId) return Utils.error(res, `Invalid user. `, 401);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });

  if (!user) return Utils.error(res, `Invalid user. `, 401);

  // ------------

  const name = req.query.name as string;
  if (!name) return Utils.error(res, `Invalid name. `, 400);

  try {
    const cr = ChatRoom.create({
      name,
      owner: user,
      users: [],
      messages: [],
    });

    cr.users.push(user);

    await cr.save();
    await user.save();

    Utils.success(res, cr.id);
  } catch (err) {
    console.log(err);
    return Utils.error(res, `Unknown error. `, 400);
  }
});

export default ChatroomCreateRouter;
