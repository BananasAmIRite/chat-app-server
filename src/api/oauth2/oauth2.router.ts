import { Router } from 'express';
import md5 from 'md5';
import User from '../../entities/User.entity';
import Utils from '../../utils/utils';

const oAuth2Router = Router();

oAuth2Router.get('/auth', async (req, res) => {
  // uses: {user: string, password: HashedString, hashed: boolean}
  // throw error "Invalid Username or Password. "
  // on success return stored token
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
  if (!dbUser || dbUser.password !== password) return Utils.error(res, `Invalid Username or Password. `, 401);

  const token = req.server.tokens.getTokenByID(dbUser.id) || Utils.genCode();
  try {
    req.server.tokens.add(token, dbUser.id);
  } catch (err) {}

  res.cookie(`session`, token);

  Utils.success(res, {
    token: token,
  });
});
// how would I go about generating access tokens

oAuth2Router.post('/revoke', async (req, res) => {
  // revokes token
  // uses: {token: string}
  const token = req.query.token;
  if (!token || typeof token !== 'string') return Utils.error(res, `No token specified. `, 400);
  if (!req.server.tokens.hasToken(token)) return Utils.error(res, `Invalid token specified. `, 400);
  req.server.tokens.remove(token);
  Utils.success(res);
});

oAuth2Router.get('/validate', async (req, res) => {
  // uses: {token: string}
  // returns: boolean on whether or not token is valid
  const token = req.query.token;
  if (!token || typeof token !== 'string') return Utils.error(res, `No token specified. `, 400);
  Utils.success(res, req.server.tokens.hasToken(token));
});

// class UserRouter extends CustomRouter {
//   constructor() {
//     super();
//   }

//   @get('/auth')
//   auth(req: Request, res: Response) {

//   }
// }

// export default new UserRouter();

export default oAuth2Router;
/*

DB MongoDB 'MongoDBRelational' {
	COLL 'ChatRoom' {
		roomId: 'room_id_here' => string; 
		messages: ['message_id_1', 'message_id_2'] => string[]; 
	}
	COLL 'User' {
		userId: 'user_id_here' => string; 
		chatRooms: ['chatRoomId1', 'chatRoomId2'] => string[]; 
	}
	COLL 'Message' {
		messageId: 'message_id_here' => string; 
		userId: 'user_id_here' => string; 
		content: 'abcdefg' => string; 
	}
}
// 

*/
