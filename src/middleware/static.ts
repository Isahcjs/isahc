
import { Context } from '../core/context.js';
import { MiddlewareFunction } from '../utils/types.js';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

export interface StaticOptions {
  root: string;
  maxAge?: number;
  index?: string[];
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf'
};

export function staticFiles(options: StaticOptions): MiddlewareFunction {
  const { root, maxAge = 0, index = ['index.html'] } = options;

  return async (ctx: Context, next: () => Promise<void>) => {
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      await next();
      return;
    }

    let filePath = join(root, ctx.path);
    
    try {
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        for (const indexFile of index) {
          const indexPath = join(filePath, indexFile);
          try {
            await stat(indexPath);
            filePath = indexPath;
            break;
          } catch {
            continue;
          }
        }
      }

      const ext = extname(filePath);
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      
      const content = await readFile(filePath);
      
      ctx.header('Content-Type', mimeType);
      if (maxAge > 0) {
        ctx.header('Cache-Control', `public, max-age=${maxAge}`);
      }
      
      ctx.res.end(content);
    } catch (error) {
      await next();
    }
  };
}
