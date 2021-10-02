import { Request, Response } from 'express';
import Utils from '../utils/utils';
import { NextFunction } from 'express-serve-static-core';

function VerifyCredentials(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return Utils.error(res, 'No credentials sent. ');
  }
  const h = req.headers.authorization;
  const formatted = h.split(' ');
  if (formatted[0] !== 'Bearer') return Utils.error(res, 'Token must be bearer token. ');
  const token = formatted[1];
  if (!req.server.tokens.hasToken(token)) return Utils.error(res, 'Invalid token', 401);
  req.authToken = token;
  next();
}

export default VerifyCredentials;
