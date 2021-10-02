import { Router } from 'express';
import ChatRoomRouter from './chatroom/chatroom.router';
import oAuth2Router from './oauth2/oauth2.router';
import UserRouter from './user/user.router';

const ApiRouter = Router();

ApiRouter.use('/oauth2', oAuth2Router);
ApiRouter.use('/user', UserRouter);
ApiRouter.use('/chatroom', ChatRoomRouter);

ApiRouter.get('/', (req, res) => {
  res.status(200).end();
});

export default ApiRouter;
