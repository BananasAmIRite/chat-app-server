// import { Router } from 'express';
// import addRoomUser from '../../../actions/addRoomUser';
// import removeRoomUser from '../../../actions/removeRoomUser';
// import User from '../../../entities/User.entity';
// import Utils from '../../../utils/utils';

import { Router } from 'express';
import Utils from '../../../utils/utils';

const ChatroomUsersRouter = Router({
  mergeParams: true,
});

ChatroomUsersRouter.get('/', (req, res) => {
  Utils.success(res, req.room?.users.map((e) => e.toWebJson()) || []);
});

ChatroomUsersRouter.use('/:e', (req, res, next) => {
  const owner = req.room?.owner;
  if (!owner) {
    next();
    return;
  }

  if (req.userId !== owner.id) return Utils.error(res, `Not allowed. `, 403);

  next();
});

// ChatroomUsersRouter.post<{ roomId: string }>('/add', async (req, res) => {
//   const usrId = parseInt(req.query.userId as string);

//   if (!usrId || isNaN(usrId)) return Utils.error(res, `Invalid request. `, 400);

//   const user = await User.findOne({
//     where: {
//       id: usrId,
//     },
//   });

//   if (!user) return Utils.error(res, `Invalid User. `, 401);

//   try {
//     const room = req.room!;

//     let hasUser = false;
//     for (const usr of room.users) {
//       if (usr.id === user.id) {
//         hasUser = true;
//         break;
//       }
//     }

//     if (hasUser) return Utils.error(res, `User already in room. `, 406);

//     await addRoomUser(req.server, room, user);

//     return Utils.success(res, true);
//   } catch (err) {
//     console.log(err);
//     return Utils.error(res, 'Unknown error. ', 500);
//   }
// });

// ChatroomUsersRouter.post<{ roomId: string }>('/remove', async (req, res) => {
//   const usrId = parseInt(req.query.userId as string);

//   if (!usrId || isNaN(usrId)) return Utils.error(res, `Invalid request. `, 400);

//   const user = await User.findOne({
//     where: {
//       id: usrId,
//     },
//   });
//   if (!user) return Utils.error(res, `Invalid User. `, 401);

//   try {
//     const room = req.room!;

//     const usrId = room.users.findIndex((e) => e.id === user.id);

//     if (usrId === -1) return Utils.error(res, `User not in room. `, 406);

//     await removeRoomUser(req.server, room, user);

//     return Utils.success(res, true);
//   } catch (err) {
//     console.log(err);
//     return Utils.error(res, 'Unknown error. ', 500);
//   }
// });

export default ChatroomUsersRouter;
