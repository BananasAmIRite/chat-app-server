// import { Router } from 'express';
// import sendMessage from '../../../actions/sendMessage';
// import Message from '../../../entities/Message.entity';
// import User from '../../../entities/User.entity';
// import Utils from '../../../utils/utils';

// const MessagesRouter = Router({
//   mergeParams: true,
// });

// MessagesRouter.get<{ roomId: string }>('/', async (req, res) => {
//   const userId = req.server.tokens.getIDByToken(req.authToken || '');
//   const take = parseInt(req.query.limit as string) || 10;
//   const skip = parseInt(req.query.skip as string) || 0;

//   const room = req.room!;

//   const user = await User.findOne({
//     where: {
//       id: userId,
//     },
//     relations: ['chatrooms'],
//   });

//   if (!user) return Utils.error(res, `No user found. `, 404);

//   // FINALLY authentication phase finished :D

//   // all that authentication for just this :(

//   try {
//     const messages = await Message.find({
//       order: {
//         id: 'DESC',
//       },
//       where: {
//         chatRoom: {
//           id: room.id,
//         },
//       },
//       take,
//       skip,
//       relations: ['user', 'chatRoom'],
//     });

//     const formattedMessages = messages.map((e) => e.toWebJson());

//     Utils.success(res, formattedMessages);
//   } catch (err: any) {
//     console.log(err);

//     Utils.error(res, err.message);
//   }
// });

// MessagesRouter.post<{ roomId: string }, any, { message: string }>('/send', async (req, res) => {
//   const message = req.body.message;
//   const userId = req.server.tokens.getIDByToken(req.authToken || '');

//   if (!message) return Utils.error(res, `No message. `, 400);

//   const room = req.room!;

//   const user = await User.findOne({
//     where: {
//       id: userId,
//     },
//     relations: ['chatrooms'],
//   });
//   if (!user) return Utils.error(res, `No user found. `, 404);

//   // FINALLY authentication phase finished :D

//   // all that authentication for just this :(

//   try {
//     // await req.server.messages.send(room, user, message);
//     sendMessage(req.server, room, user, message);
//     Utils.success(res, true);
//   } catch (err: any) {
//     console.log(err);

//     Utils.error(res, `Unknown error.`, 500);
//   }
// });

// export default MessagesRouter;
