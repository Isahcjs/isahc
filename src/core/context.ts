
import { IncomingMessage, ServerResponse } from 'http';
import { HttpUtils } from '../utils/http.js';
import { StreamUtils } from '../utils/stream.js';
import { Headers } from '../utils/types.js';

export class Context {
  public req: IncomingMessage;
  public res: ServerResponse;
  public params: Record<string, string> = {};
  public query: URLSearchParams;
  public state: Record<string, any> = {};
  private _body: any = null;
  private _bodyParsed = false;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
    
    const { query } = HttpUtils.parseUrl(req.url || '/');
    this.query = query;
  }

  get method(): string {
    return this.req.method || 'GET';
  }

  get url(): string {
    return this.req.url || '/';
  }

  get path(): string {
    return HttpUtils.parseUrl(this.url).pathname;
  }

  get headers(): Headers {
    return this.req.headers as Headers;
  }

  async body(): Promise<any> {
    if (this._bodyParsed) {
      return this._body;
    }

    this._bodyParsed = true;

    if (this.method === 'GET' || this.method === 'HEAD') {
      return null;
    }

    try {
      const bodyStr = await StreamUtils.streamToString(this.req);
      
      const contentType = this.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        this._body = JSON.parse(bodyStr);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        this._body = Object.fromEntries(new URLSearchParams(bodyStr));
      } else {
        this._body = bodyStr;
      }
    } catch (error) {
      this._body = null;
    }

    return this._body;
  }

  status(code: number): this {
    this.res.statusCode = code;
    return this;
  }

  header(name: string, value: string): this {
    this.res.setHeader(name, value);
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    for (const [name, value] of Object.entries(headers)) {
      this.res.setHeader(name, value);
    }
    return this;
  }

  json(data: any): void {
    this.header('Content-Type', 'application/json; charset=utf-8');
    this.res.end(JSON.stringify(data));
  }

  text(data: string): void {
    this.header('Content-Type', 'text/plain; charset=utf-8');
    this.res.end(data);
  }

  html(data: string): void {
    this.header('Content-Type', 'text/html; charset=utf-8');
    this.res.end(data);
  }

  send(data: any): void {
    if (typeof data === 'string') {
      this.text(data);
    } else if (typeof data === 'object') {
      this.json(data);
    } else {
      this.text(String(data));
    }
  }

  redirect(url: string, status = 302): void {
    this.status(status);
    this.header('Location', url);
    this.res.end();
  }
}
