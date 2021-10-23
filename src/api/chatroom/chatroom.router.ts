import { Router } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import ChatRoom from '../../entities/ChatRoom.entity';
import User from '../../entities/User.entity';
import VerifyCredentials from '../../middlewares/VerifyCredentials';
import Utils from '../../utils/utils';
import ChatroomCreateRouter from './create/ChatroomCreateRouter';
import ChatroomDeleteRouter from './delete/ChatroomDeleteRouter';
import MessagesRouter from './messages/messages.router';
import ChatroomUsersRouter from './users/user.router';

const ChatRoomRouter = Router();

export interface ChatRoomRouterGenerics {
  '/:roomId': {
    P: ParamsDictionary & { roomId: string };
    ResBody: any;
    ReqBody: any;
    ReqQuery: Query;
    Locals: {
      room: ChatRoom;
    };
  };
}

ChatRoomRouter.use(VerifyCredentials);

ChatRoomRouter.use('/:roomId', async (req, res, next) => {
  const roomId = req.params.roomId;
  const room = await ChatRoom.findOne({
    where: {
      id: roomId,
    },
    relations: ['messages', 'users'],
  });
  if (!room) return Utils.error(res, 'Invalid room. ', 404);

  let hasUser = false;

  for (const usr of room.users) {
    if (usr.id === req.userId) {
      hasUser = true;
      break;
    }
  }

  if (!hasUser) return Utils.error(res, `User does not have access to the specified room. `, 403);

  req.room = room;
  next();
});

ChatRoomRouter.get('/', (req, res) => {
  res.status(200).end();
});

// ChatRoomRouter.use('/:roomId/message', MessageRouter); // depreacted in favor of POST api/chatroom/:roomId/messages/send
ChatRoomRouter.use('/:roomId/messages', MessagesRouter);
ChatRoomRouter.use('/:roomId/delete', ChatroomDeleteRouter);
ChatRoomRouter.use('/:roomId/users', ChatroomUsersRouter);
ChatRoomRouter.use('/create', ChatroomCreateRouter);

ChatRoomRouter.use('/:roomId', (req, res) => {
  Utils.success(res, { ...req.room?.toWebJson(), users: undefined });
});

export default ChatRoomRouter;
