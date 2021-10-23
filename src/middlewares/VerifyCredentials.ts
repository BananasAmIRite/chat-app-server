import { Request, Response } from 'express';
import Utils from '../utils/utils';
import { NextFunction } from 'express-serve-static-core';

function VerifyCredentials(req: Request, res: Response, next: NextFunction) {
  let token;
  if (req.headers.authorization) {
    const formatted = req.headers.authorization.split(' ');
    if (formatted?.[0] !== 'Bearer') return Utils.error(res, 'Token must be bearer token. ');
    token = formatted[1];
  } else if (req.cookies.session) {
    token = req.cookies.session;
  } else return Utils.error(res, `No credentials sent.`, 401);

  const id = req.server.tokens.getIDByToken(token);

  if (!req.server.tokens.hasToken(token) || !id) return Utils.error(res, 'Invalid token', 401);

  req.userId = id;
  req.authToken = token;
  next();
}

export default VerifyCredentials;
