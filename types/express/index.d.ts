import ChatRoom from '../../src/entities/ChatRoom.entity';
import ChatServer from '../../src/Server';
import TokenStore from '../../src/TokenStore';

declare global {
  namespace Express {
    interface Request {
      server: ChatServer;
      userId?: number;
      authToken?: string;
      room?: ChatRoom;
    } // just add data to the Socket object
  }
}
