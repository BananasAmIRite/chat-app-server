import { Router } from 'express';
import ChatRoom from '../../../entities/ChatRoom.entity';
import Message from '../../../entities/Message.entity';
import User from '../../../entities/User.entity';
import Utils from '../../../utils/utils';

const MessagesRouter = Router({
  mergeParams: true,
});

MessagesRouter.get('/', async (req, res) => {
  // @ts-ignore
  const roomId = req.params.roomId;
  const userId = req.server.tokens.getIDByToken(req.authToken || '');
  const take = parseInt(req.query.limit as string) || 10;
  const skip = parseInt(req.query.skip as string) || 0;

  if (!userId) return Utils.error(res, `Invalid user. `, 401);

  const room = await ChatRoom.findOne({
    where: {
      id: roomId,
    },
    relations: ['messages'],
  });

  if (!room) return Utils.error(res, `No room found. `, 404);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });
  if (!user) return Utils.error(res, `No user found. `, 404);

  // can't check if it has normally thats annoying

  let hasChatroom = false;

  for (const cr of user.chatrooms) {
    if (cr.id === room.id) {
      hasChatroom = true;
      break;
    }
  }

  if (!hasChatroom) return Utils.error(res, `User does not have access to the specified room. `, 403);

  // FINALLY authentication phase finished :D

  // all that authentication for just this :(

  try {
    const messages = await Message.find({
      order: {
        id: 'DESC',
      },
      where: {
        chatRoom: {
          id: room.id,
        },
      },
      take,
      skip,
      relations: ['user', 'chatRoom'],
    });

    const formattedMessages = messages.map((e) => {
      return { ...e, user: undefined, chatRoom: undefined, userId: e.user?.id };
    });

    Utils.success(res, formattedMessages);
  } catch (err: any) {
    Utils.error(res, err.message);
  }
});

MessagesRouter.post('/send', async (req, res) => {
  // @ts-ignore
  const roomId = req.params.roomId;
  const message = req.query.message as string;
  const userId = req.server.tokens.getIDByToken(req.authToken || '');

  if (!userId) return Utils.error(res, `Invalid user. `, 401);
  if (!message) return Utils.error(res, `No message. `, 400);

  const room = await ChatRoom.findOne({
    where: {
      id: roomId,
    },
    relations: ['users'],
  });

  if (!room) return Utils.error(res, `No room found. `, 404);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });
  if (!user) return Utils.error(res, `No user found. `, 404);

  // can't check if it has normally thats annoying

  let hasChatroom = false;

  for (const cr of user.chatrooms) {
    if (cr.id === room.id) {
      hasChatroom = true;
      break;
    }
  }

  if (!hasChatroom) return Utils.error(res, `User does not have access to the specified room. `, 403);

  // FINALLY authentication phase finished :D

  // all that authentication for just this :(

  try {
    await req.server.messages.send(room, user, message);
    Utils.success(res, true);
  } catch (err: any) {
    console.log(err);

    Utils.error(res, `Unknown error.`, 400);
  }
});

export default MessagesRouter;
