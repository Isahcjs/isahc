
import { Headers } from './types.js';

export class HttpUtils {
  private static readonly STATUS_CODES = new Map([
    [200, 'OK'],
    [201, 'Created'],
    [204, 'No Content'],
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [405, 'Method Not Allowed'],
    [500, 'Internal Server Error'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable']
  ]);

  static getStatusText(code: number): string {
    return this.STATUS_CODES.get(code) || 'Unknown';
  }

  static parseHeaders(headers: Headers): Record<string, string> {
    const parsed: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        parsed[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value;
      }
    }
    return parsed;
  }

  static parseUrl(url: string): { pathname: string; query: URLSearchParams } {
    const parsed = new URL(url, 'http://localhost');
    return {
      pathname: parsed.pathname,
      query: parsed.searchParams
    };
  }

  static matchPath(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
    const params: Record<string, string> = {};
    
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);
    
    if (!match) {
      return { match: false, params };
    }

    // Extract parameters
    const paramNames = pattern.match(/:[^/]+/g) || [];
    paramNames.forEach((param, index) => {
      const paramName = param.slice(1);
      params[paramName] = match[index + 1];
    });

    return { match: true, params };
  }

  static createQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    return searchParams.toString();
  }
}
