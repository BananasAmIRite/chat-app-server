import { Router } from 'express';
import User from '../../../entities/User.entity';
import Utils from '../../../utils/utils';

const GetUserRouter = Router();

/**
 * /userId/byUsername and /userId/byId
 *
 * or
 *
 * /userId?method=username
 * /userId?method=id
 *
 */

GetUserRouter.get('/byName/:userName', async (req, res) => {
  const user = req.params.userName;

  const userData = await User.findOne({
    where: { user },
  });

  if (!userData) return Utils.error(res, 'Unable to find user. ', 404);

  return Utils.success(res, userData.toWebJson());
});

GetUserRouter.get('/byId/:userId', async (req, res) => {
  const id = req.params.userId;

  const userData = await User.findOne({
    where: { id },
  });

  if (!userData) return Utils.error(res, 'Unable to find user. ', 404);

  return Utils.success(res, userData?.toWebJson());
});

export default GetUserRouter;
