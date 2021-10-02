import { Router } from 'express';
import VerifyCredentials from '../../middlewares/VerifyCredentials';
import ChatroomCreateRouter from './create/ChatroomCreateRouter';
import ChatroomDeleteRouter from './delete/ChatroomDeleteRouter';
import MessagesRouter from './messages/messages.router';

const ChatRoomRouter = Router();

ChatRoomRouter.use(VerifyCredentials);

ChatRoomRouter.get('/', (req, res) => {
  res.status(200).end();
});

// ChatRoomRouter.use('/:roomId/message', MessageRouter); // depreacted in favor of POST api/chatroom/:roomId/messages/send
ChatRoomRouter.use('/:roomId/messages', MessagesRouter);
ChatRoomRouter.use('/:roomId/delete', ChatroomDeleteRouter);
ChatRoomRouter.use('/create', ChatroomCreateRouter);

export default ChatRoomRouter;
