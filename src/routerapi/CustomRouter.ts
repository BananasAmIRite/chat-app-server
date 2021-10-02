import { IRouterHandler, IRouterMatcher, Router } from 'express';
import { Router as IRouter } from 'express-serve-static-core';
import { get, RequestType } from './decorators';

// fun little testing thing i did, dont worry about this

export default class CustomRouter {
  public _router: IRouter;
  public testVar: string;
  constructor() {
    this._router = Router();
    this.testVar = 'test';

    this._registerRequestTypes();
  }

  private _registerRequestTypes() {
    const prototype = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(this)) {
      const val = prototype[key];
      if (typeof val !== 'function') continue;
      const metadata = Reflect.getMetadata('request:type', prototype, val);
      if (!metadata || !metadata.type || !metadata.route) continue;
      const type = metadata.type;
      const route = metadata.route;

      switch (type) {
        case RequestType.GET:
          this._router.get(route, val.bind(this));
          break;
        case RequestType.POST:
          this._router.post(route, val.bind(this));
      }
    }
  }

  @get('/a')
  getThing(req: Request, res: Response) {
    console.log(req);
  }

  public use: IRouterHandler<this> & IRouterMatcher<this> = (...args: any[]): this => {
    this._router.use(...args);
    return this;
  };

  public get router() {
    return this._router;
  }
}
