import { Request, Response } from 'express';
import Utils from '../utils/utils';
import { NextFunction } from 'express-serve-static-core';
import { Socket } from 'socket.io';
import ChatServer from '../Server';
import WebError from '../errors/WebError';

function VerifyCredentials(req: Request, res: Response, next: NextFunction) {
  let resolvedData: [number?, string?] = [];
  try {
    if (req.headers.authorization) {
      resolvedData = validateAuthorizationCredentials(req.headers.authorization);
    } else if (req.cookies.session) {
      resolvedData = validateCookieCredentials(req.cookies.session);
    } else return Utils.error(res, `No credentials sent.`, 401);
  } catch (err: any) {
    if (err instanceof WebError) return Utils.error(res, err.message, err.code);
  }

  const [id, token] = resolvedData;

  req.userId = id;
  req.authToken = token;
  next();
}

function validateCookieCredentials(token: string): [number, string] {
  const id = ChatServer.instance.tokens.getIDByToken(token);

  if (!ChatServer.instance.tokens.hasToken(token) || !id) throw new WebError('Invalid token', 401);

  return [id, token];
}

function validateAuthorizationCredentials(authorizationStr: string): [number, string] {
  const formatted = authorizationStr.split(' ');
  if (formatted?.[0] !== 'Bearer') throw new WebError('Token must be bearer token. ', 400);
  const token = formatted[1];

  const id = ChatServer.instance.tokens.getIDByToken(token);

  if (!ChatServer.instance.tokens.hasToken(token) || !id) throw new WebError('Invalid token', 401);

  return [id, token];
}

export function verifySocketCredentials(socket: Socket<any, any, any, any>): false | [number?, string?] {
  const cookieString = socket.request.headers.cookie;

  // parse cookiestring
  const parsed =
    cookieString
      ?.split('; ')
      .reduce<{ session?: string }>((p, c) => ({ ...p, [c.split('=')[0]]: c.split('=')[1] }), {}) || {};

  let resolvedData: [number?, string?] = [];
  try {
    if (socket.request.headers.authorization) {
      resolvedData = validateAuthorizationCredentials(socket.request.headers.authorization);
    } else if (parsed.session) {
      resolvedData = validateCookieCredentials(parsed.session);
    } else throw new WebError(`No credentials sent.`, 401);
  } catch (err: any) {
    if (err instanceof WebError) return false;
  }

  if (resolvedData[0] === undefined || resolvedData[1] === undefined) return false;

  // store a map of socketid to userid

  return resolvedData;
  // this returns [userid, usertoken];
}

export default VerifyCredentials;
