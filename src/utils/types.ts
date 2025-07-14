
export interface HttpMethod {
  GET: 'GET';
  POST: 'POST';
  PUT: 'PUT';
  DELETE: 'DELETE';
  PATCH: 'PATCH';
  HEAD: 'HEAD';
  OPTIONS: 'OPTIONS';
}

export type Method = keyof HttpMethod;

export interface Headers {
  [key: string]: string | string[] | undefined;
}

export interface RequestOptions {
  method?: Method;
  headers?: Headers;
  body?: any;
  timeout?: number;
  retries?: number;
  baseURL?: string;
}

export interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface MiddlewareFunction {
  (ctx: any, next: () => Promise<void>): Promise<void>;
}

export interface RouteHandler {
  (ctx: any): Promise<void> | void;
}

export interface RouteDefinition {
  method: Method;
  path: string;
  handler: RouteHandler;
  middleware?: MiddlewareFunction[];
}
