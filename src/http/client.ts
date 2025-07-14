
import { request, RequestOptions as NodeRequestOptions, ClientRequest } from 'http';
import { request as httpsRequest } from 'https';
import { URL } from 'url';
import { RequestOptions, ResponseData, Headers } from '../utils/types.js';
import { HttpUtils } from '../utils/http.js';

export class HttpClient {
  private baseURL?: string;
  private defaultHeaders: Headers = {};
  private timeout: number = 30000;

  constructor(baseURL?: string) {
    this.baseURL = baseURL;
  }

  setHeader(name: string, value: string): this {
    this.defaultHeaders[name] = value;
    return this;
  }

  setHeaders(headers: Headers): this {
    Object.assign(this.defaultHeaders, headers);
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  async request<T = any>(url: string, options: RequestOptions = {}): Promise<ResponseData<T>> {
    const fullUrl = this.resolveUrl(url);
    const parsedUrl = new URL(fullUrl);
    
    const isHttps = parsedUrl.protocol === 'https:';
    const requestFn = isHttps ? httpsRequest : request;

    const headers = {
      ...HttpUtils.parseHeaders(this.defaultHeaders),
      ...HttpUtils.parseHeaders(options.headers || {})
    };

    // Set default headers
    if (!headers['user-agent']) {
      headers['user-agent'] = 'isahc/1.0.0';
    }

    const requestOptions: NodeRequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers,
      timeout: options.timeout || this.timeout
    };

    return new Promise((resolve, reject) => {
      const req: ClientRequest = requestFn(requestOptions, (res) => {
        const chunks: Buffer[] = [];
        
        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          let data: any = buffer;

          // Parse response based on content type
          const contentType = res.headers['content-type'] || '';
          
          try {
            if (contentType.includes('application/json')) {
              data = JSON.parse(buffer.toString('utf8'));
            } else if (contentType.includes('text/')) {
              data = buffer.toString('utf8');
            }
          } catch (error) {
            // Keep raw buffer if parsing fails
          }

          const response: ResponseData<T> = {
            data,
            status: res.statusCode || 200,
            statusText: res.statusMessage || HttpUtils.getStatusText(res.statusCode || 200),
            headers: res.headers as Headers
          };

          resolve(response);
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      // Handle request body
      if (options.body && options.method !== 'GET' && options.method !== 'HEAD') {
        let body: string;
        
        if (typeof options.body === 'string') {
          body = options.body;
        } else if (typeof options.body === 'object') {
          body = JSON.stringify(options.body);
          req.setHeader('Content-Type', 'application/json');
        } else {
          body = String(options.body);
        }

        req.setHeader('Content-Length', Buffer.byteLength(body));
        req.write(body);
      }

      req.end();
    });
  }

  // Convenience methods
  async get<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...options, method: 'POST', body: data });
  }

  async put<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data });
  }

  async delete<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  async patch<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH', body: data });
  }

  private resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (this.baseURL) {
      return new URL(url, this.baseURL).toString();
    }
    
    return url;
  }
}
