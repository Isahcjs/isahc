
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { Context } from './context.js';
import { Router } from '../router/router.js';

export interface ServerOptions {
  port?: number;
  host?: string;
  keepAliveTimeout?: number;
  headersTimeout?: number;
}

export class HttpServer {
  private server: Server;
  private router: Router;
  private options: ServerOptions;

  constructor(router: Router, options: ServerOptions = {}) {
    this.router = router;
    this.options = {
      port: 5000,
      host: '0.0.0.0',
      keepAliveTimeout: 5000,
      headersTimeout: 60000,
      ...options
    };

    this.server = createServer();
    this.setupServer();
  }

  private setupServer(): void {
    // Performance optimizations
    this.server.keepAliveTimeout = this.options.keepAliveTimeout!;
    this.server.headersTimeout = this.options.headersTimeout!;
    this.server.maxHeadersCount = 100;

    this.server.on('request', this.handleRequest.bind(this));
    
    this.server.on('error', (error) => {
      console.error('Server error:', error);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => this.close());
    process.on('SIGINT', () => this.close());
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const ctx = new Context(req, res);

    try {
      const handled = await this.router.handle(ctx);
      
      if (!handled) {
        ctx.status(404).json({
          error: 'Not Found',
          message: `Cannot ${ctx.method} ${ctx.path}`
        });
      }
    } catch (error) {
      console.error('Request error:', error);
      
      if (!res.headersSent) {
        ctx.status(500).json({
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
        });
      }
    }
  }

  listen(callback?: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.options.port, this.options.host, () => {
        console.log(`🚀 Server running on http://${this.options.host}:${this.options.port}`);
        if (callback) callback();
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('Server closed');
        resolve();
      });
    });
  }

  address() {
    return this.server.address();
  }
}
