import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, Router, urlencoded, Request } from 'express';
import Utils from './utils/utils';
import ApiRouter from './api/api.router';
import TokenStore from './TokenStore';
import { createConnection } from 'typeorm';
import EventsManager from './EventsManager';
import EventSocketManager from './EventSocketManager';
import MessageManager from './MessageManager';
import bodyParser from 'body-parser';
import { createServer, Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import registerListeners from './registerListeners';
import expressWs from 'express-ws';

export default class ChatServer {
  public static instance: ChatServer;

  private _server: express.Application;
  private httpServer: HttpServer;
  private io: IOServer;
  private _tokens: TokenStore;
  private _events: EventsManager;
  private _socketManager: EventSocketManager<number>;
  private _messages: MessageManager;
  constructor() {
    this._server = express();
    this._tokens = new TokenStore();
    this._events = new EventsManager();
    this._messages = new MessageManager(this);
    this.registerMiddlewares();
    this.registerRouters();

    this.httpServer = createServer(this._server);
    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });

    this._socketManager = new EventSocketManager<number>(this.io);

    registerListeners(this, this.io);

    this.createDBConnection();

    ChatServer.instance = this;
  }

  registerRouter(route: string, router: Router) {
    this._server.use(route, router);
  }

  private registerRouters(): void {
    this.registerRouter('/api', ApiRouter);
  }

  private registerMiddlewares(): void {
    this._server.use(urlencoded({ extended: true }));
    this._server.use(json());
    this._server.use(bodyParser.urlencoded({ extended: true }));
    this._server.use(bodyParser.json());
    this._server.use(
      cors({
        origin: 'http://localhost:3000',

        credentials: true,
      })
    );
    this._server.use(cookieParser());
    this._server.use((req: Request, res, next) => {
      req.server = this;
      // req.tokenStore = this.tokens; // attach token store every time
      next();
    });
  }

  start(port: number, callback?: () => void) {
    const normalized = Utils.normalizePort(port);
    this.httpServer.listen(normalized, callback);
    // this._server.listen(normalized);
  }

  createDBConnection() {
    createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'chatapp',
      entities: [__dirname + '/entities/**/*.ts'],
      // logging: true,
      synchronize: true,
      // logging: 'all',
      // log anything that takes more than a second
      maxQueryExecutionTime: 1000,
    });
  }

  get server() {
    return this._server;
  }

  get tokens() {
    return this._tokens;
  }

  get events() {
    return this._events;
  }

  get eventSockets() {
    return this._socketManager;
  }

  get messages() {
    return this._messages;
  }
}
