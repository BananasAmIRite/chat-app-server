import ChatServer from '../../src/Server';
import TokenStore from '../../src/TokenStore';

declare global {
  namespace Express {
    interface Request {
      server: ChatServer;
      authToken?: string;
    }
  }
}