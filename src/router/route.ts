
import { Context } from '../core/context.js';
import { RouteHandler, MiddlewareFunction, Method } from '../utils/types.js';

export class Route {
  public method: Method;
  public path: string;
  public handler: RouteHandler;
  public middleware: MiddlewareFunction[];

  constructor(method: Method, path: string, handler: RouteHandler, middleware: MiddlewareFunction[] = []) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.middleware = middleware;
  }

  async execute(ctx: Context): Promise<void> {
    // Execute middleware chain
    let index = 0;
    
    const next = async (): Promise<void> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(ctx, next);
      } else {
        // Execute final handler
        await this.handler(ctx);
      }
    };

    await next();
  }
}
