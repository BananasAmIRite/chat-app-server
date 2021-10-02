import express, { Router } from 'express';
import expressWs from 'express-ws';
import VerifyCredentials from '../../middlewares/VerifyCredentials';

const app = expressWs(express());

const UserRouter = Router() as expressWs.Router;

UserRouter.use(VerifyCredentials);

UserRouter.get('/', (req, res) => {
  res.status(200).end();
});

UserRouter.ws('/events', (ws, req) => {
  const token = req.authToken;
  if (!token) return ws.close();

  const userId = req.server.tokens.getIDByToken(token);
  if (!userId) return ws.close();

  req.server.eventSockets.addSocket(userId, ws);

  ws.on('message', (msg) => {
    // format: {
    //     name: string;
    //     ... other args
    // }
    // authentication: Bearer [token]
    let evt;
    try {
      evt = JSON.parse(msg.toString());
    } catch (err) {
      return;
    }
    if (!evt.name) return;

    req.server.events.emit(evt.name, token, evt);
  });
});

export default UserRouter;
