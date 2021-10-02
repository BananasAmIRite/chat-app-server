import { Response } from 'express';

export default class Utils {
  static normalizePort(port: number, def = 2000): number {
    // stackoverflow is cool

    if (isNaN(port)) {
      // named pipe
      return def;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return def;
  }

  static sendCode(res: Response, code: number, body: Exclude<{ [key: string]: any }, 'code'>): void {
    const finalObj = {
      ...body,
      code: code,
    };
    res.status(code).send(finalObj);
  }

  static error(res: Response, error: string, code = 400) {
    this.sendCode(res, code, { error, success: false });
  }

  static success(res: Response, response?: any, code = 200) {
    this.sendCode(res, code, response !== undefined ? { response, success: true } : {});
  }

  static genCode() {
    const val = Math.random() * Date.now();
    const d = val.toString().split('.')[1];
    const newVal = val * Math.pow(10, d.length);
    return newVal.toString(20);
  }
}
