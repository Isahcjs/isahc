
import { Context } from '../core/context.js';
import { MiddlewareFunction } from '../utils/types.js';

export interface JsonOptions {
  limit?: string;
  strict?: boolean;
}

export function json(options: JsonOptions = {}): MiddlewareFunction {
  return async (ctx: Context, next: () => Promise<void>) => {
    const contentType = ctx.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        ctx.state.body = await ctx.body();
      } catch (error) {
        ctx.status(400).json({ error: 'Invalid JSON' });
        return;
      }
    }
    
    await next();
  };
}
