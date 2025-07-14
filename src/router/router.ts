
import { Route } from './route.js';
import { Layer } from './layer.js';
import { Context } from '../core/context.js';
import { RouteHandler, MiddlewareFunction, Method } from '../utils/types.js';

export class Router {
  private layers: Layer[] = [];
  private middleware: MiddlewareFunction[] = [];

  // HTTP method handlers
  get(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('GET', path, handlers);
  }

  post(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('POST', path, handlers);
  }

  put(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('PUT', path, handlers);
  }

  delete(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('DELETE', path, handlers);
  }

  patch(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('PATCH', path, handlers);
  }

  head(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('HEAD', path, handlers);
  }

  options(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): this {
    return this.addRoute('OPTIONS', path, handlers);
  }

  // Add global middleware
  use(middleware: MiddlewareFunction): this {
    this.middleware.push(middleware);
    return this;
  }

  private addRoute(method: Method, path: string, handlers: (RouteHandler | MiddlewareFunction)[]): this {
    const handler = handlers.pop() as RouteHandler;
    const routeMiddleware = handlers as MiddlewareFunction[];
    
    const route = new Route(method, path, handler, [...this.middleware, ...routeMiddleware]);
    const layer = new Layer(route);
    
    this.layers.push(layer);
    return this;
  }

  async handle(ctx: Context): Promise<boolean> {
    for (const layer of this.layers) {
      const { match, params } = layer.match(ctx.method, ctx.path);
      
      if (match) {
        ctx.params = params;
        await layer.execute(ctx);
        return true;
      }
    }
    
    return false;
  }

  routes(): Layer[] {
    return [...this.layers];
  }
}
