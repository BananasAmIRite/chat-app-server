import express, { Router } from 'express';
import expressWs from 'express-ws';
import User from '../../entities/User.entity';
import VerifyCredentials from '../../middlewares/VerifyCredentials';
import Utils from '../../utils/utils';
import GetUserRouter from './getuser/getuser.router';

const app = expressWs(express());

const UserRouter = Router() as expressWs.Router;

UserRouter.use(VerifyCredentials);

UserRouter.get('/', (req, res) => {
  res.status(200).end();
});

// // i have a websocket set up here, how would I have socket.io listen on this endpoint?
// // it request ws://localhost.../events
// UserRouter.ws('/events', (ws, req) => {
//   console.log('WEBSCOKETAWSD');

//   const token = req.authToken;
//   console.log('token: ' + token);

//   if (!token) return ws.close();

//   const userId = req.server.tokens.getIDByToken(token);
//   console.log('userId: ' + userId);

//   if (!userId) return ws.close();

//   req.server.eventSockets.addSocket(userId, ws);

//   ws.on('message', (msg) => {
//     // format: {
//     //     name: string;
//     //     ... other args
//     // }
//     // authentication: Bearer [token]
//     let evt;
//     try {
//       evt = JSON.parse(msg.toString());
//     } catch (err) {
//       return;
//     }
//     if (!evt.name) return;

//     req.server.events.emit(evt.name, token, evt);
//   });
// });

UserRouter.get('/me', async (req, res) => {
  const token = req.authToken || '';

  const userId = req.server.tokens.getIDByToken(token);
  if (!token || !userId) return Utils.error(res, 'Invalid token. ', 401);

  const user = await User.findOne({
    where: {
      id: userId,
    },
    relations: ['chatrooms'],
  });

  if (!user) return Utils.error(res, `Invalid user. `, 401);

  Utils.success(res, user.toWebJson());
});

UserRouter.use('/getuser', GetUserRouter);

export default UserRouter;
