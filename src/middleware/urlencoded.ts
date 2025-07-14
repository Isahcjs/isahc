
import { Context } from '../core/context.js';
import { MiddlewareFunction } from '../utils/types.js';

export interface UrlencodedOptions {
  limit?: string;
  extended?: boolean;
}

export function urlencoded(options: UrlencodedOptions = {}): MiddlewareFunction {
  return async (ctx: Context, next: () => Promise<void>) => {
    const contentType = ctx.headers['content-type'] || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      try {
        ctx.state.body = await ctx.body();
      } catch (error) {
        ctx.status(400).json({ error: 'Invalid form data' });
        return;
      }
    }
    
    await next();
  };
}
