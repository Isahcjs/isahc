
import { Router } from '../router/router.js';
import { HttpServer, ServerOptions } from './server.js';
import { Context } from './context.js';
import { MiddlewareFunction, RouteHandler } from '../utils/types.js';

export class Application extends Router {
  private server?: HttpServer;

  constructor() {
    super();
  }

  // Convenience methods that delegate to router
  listen(port?: number, callback?: () => void): Promise<void>;
  listen(port?: number, host?: string, callback?: () => void): Promise<void>;
  listen(options?: ServerOptions, callback?: () => void): Promise<void>;
  listen(portOrOptions?: number | ServerOptions, hostOrCallback?: string | (() => void), callback?: () => void): Promise<void> {
    let options: ServerOptions = {};
    let cb: (() => void) | undefined;

    if (typeof portOrOptions === 'number') {
      options.port = portOrOptions;
      if (typeof hostOrCallback === 'string') {
        options.host = hostOrCallback;
        cb = callback;
      } else {
        cb = hostOrCallback;
      }
    } else if (portOrOptions) {
      options = portOrOptions;
      cb = hostOrCallback as (() => void);
    } else {
      cb = hostOrCallback as (() => void);
    }

    this.server = new HttpServer(this, options);
    return this.server.listen(cb);
  }

  close(): Promise<void> {
    if (this.server) {
      return this.server.close();
    }
    return Promise.resolve();
  }

  address() {
    return this.server?.address();
  }

  // Error handling
  onError(handler: (error: Error, ctx: Context) => void): this {
    // TODO: Implement global error handling
    return this;
  }
}
