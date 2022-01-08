import { Router } from 'express';
import md5 from 'md5';
import User from '../../entities/User.entity';
import Utils from '../../utils/utils';

const SignupRouter = Router();

SignupRouter.post('/', async (req, res) => {
  let unParsedHashed = req.query.hashed;
  const user = req.query.user;
  let password = req.query.password;
  if (unParsedHashed != undefined && typeof unParsedHashed !== 'string') unParsedHashed = undefined;
  if (typeof user !== 'string' || typeof password !== 'string')
    return Utils.error(res, `Invalid Username or Password. `, 400);
  // vv whether or not the data sent is a hashed data or not
  const hashed = unParsedHashed === 'true' || unParsedHashed === undefined ? true : false; // hesitant to use JSON.parse cuz invalid inputs

  if (!hashed) password = md5(password); // hash the password

  const dbUser = await User.findOne({
    user,
  });

  if (dbUser) return Utils.error(res, 'User already exists. ', 403);

  // checking username validity
  const FORBIDDEN_CHARS = '*@:=/[?]|\\"<>+;. ';
  for (const char of FORBIDDEN_CHARS) {
    if (user.includes(char)) {
      return Utils.error(res, 'Username contains a forbidden character. ', 400);
    }
  }

  try {
    const newUser = User.create({
      user,
      password,
      chatrooms: [],
    });
    await newUser.save();
    return Utils.success(res, { successful: true });
  } catch (err) {
    console.error(err);
    return Utils.error(res, 'Unknown database error. ', 500);
  }
});

export default SignupRouter;
