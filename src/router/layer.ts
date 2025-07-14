
import { Route } from './route.js';
import { HttpUtils } from '../utils/http.js';
import { Context } from '../core/context.js';

export class Layer {
  public route: Route;
  private pathRegex: RegExp;
  private paramNames: string[];

  constructor(route: Route) {
    this.route = route;
    this.paramNames = [];
    
    // Pre-compile regex for performance
    this.pathRegex = this.compilePathRegex(route.path);
  }

  private compilePathRegex(path: string): RegExp {
    // Extract parameter names
    const paramMatches = path.match(/:[^/]+/g) || [];
    this.paramNames = paramMatches.map(param => param.slice(1));
    
    // Convert to regex pattern
    const pattern = path
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/');
    
    return new RegExp(`^${pattern}$`);
  }

  match(method: string, path: string): { match: boolean; params: Record<string, string> } {
    if (this.route.method !== method) {
      return { match: false, params: {} };
    }

    const match = path.match(this.pathRegex);
    if (!match) {
      return { match: false, params: {} };
    }

    const params: Record<string, string> = {};
    this.paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return { match: true, params };
  }

  async execute(ctx: Context): Promise<void> {
    await this.route.execute(ctx);
  }
}
