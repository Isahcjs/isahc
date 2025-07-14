
// Core exports
export { Application } from './core/application.js';
export { Context } from './core/context.js';
export { Router } from './router/router.js';
export { HttpServer } from './core/server.js';

// HTTP Client exports
export { HttpClient, fetch, createClient, get, post, put, del, patch } from './http/fetch.js';

// Middleware exports
export { json } from './middleware/json.js';
export { urlencoded } from './middleware/urlencoded.js';
export { staticFiles } from './middleware/static.js';

// Utility exports
export { HttpUtils } from './utils/http.js';
export { StreamUtils } from './utils/stream.js';

// Type exports
export type {
  Headers,
  RequestOptions,
  ResponseData,
  MiddlewareFunction,
  RouteHandler,
  RouteDefinition,
  Method
} from './utils/types.js';

// Import classes for createApp and default export
import { Application } from './core/application.js';
import { Context } from './core/context.js';
import { Router } from './router/router.js';
import { HttpServer } from './core/server.js';
import { HttpClient, fetch, createClient, get, post, put, del, patch } from './http/fetch.js';
import { json } from './middleware/json.js';
import { urlencoded } from './middleware/urlencoded.js';
import { staticFiles } from './middleware/static.js';
import { HttpUtils } from './utils/http.js';
import { StreamUtils } from './utils/stream.js';

// Create app function for convenience
export function createApp() {
  return new Application();
}

// Default export
export default {
  createApp,
  Application,
  Context,
  Router,
  HttpServer,
  HttpClient,
  fetch,
  createClient,
  get,
  post,
  put,
  del,
  patch,
  json,
  urlencoded,
  staticFiles,
  HttpUtils,
  StreamUtils
};
