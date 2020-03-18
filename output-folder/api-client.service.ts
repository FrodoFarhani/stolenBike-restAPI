/* tslint:disable */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DefaultHttpOptions, HttpOptions, APIClientInterface } from './';

import * as models from './models';

export const USE_DOMAIN = new InjectionToken<string>('APIClient_USE_DOMAIN');
export const USE_HTTP_OPTIONS = new InjectionToken<HttpOptions>('APIClient_USE_HTTP_OPTIONS');

type APIHttpOptions = HttpOptions & {
  headers: HttpHeaders;
  params: HttpParams;
  responseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
};

/**
 * Created with https://github.com/flowup/api-client-generator
 */
@Injectable()
export class APIClient implements APIClientInterface {

  readonly options: APIHttpOptions;

  readonly domain: string = `//${window.location.hostname}${window.location.port ? ':'+window.location.port : ''}/api`;

  constructor(private readonly http: HttpClient,
              @Optional() @Inject(USE_DOMAIN) domain?: string,
              @Optional() @Inject(USE_HTTP_OPTIONS) options?: DefaultHttpOptions) {

    if (domain != null) {
      this.domain = domain;
    }

    this.options = {
      headers: new HttpHeaders(options && options.headers ? options.headers : {}),
      params: new HttpParams(options && options.params ? options.params : {}),
      ...(options && options.reportProgress ? { reportProgress: options.reportProgress } : {}),
      ...(options && options.withCredentials ? { withCredentials: options.withCredentials } : {})
    };
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getCases(
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/cases`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  postCases(
    args: {
      body: any,  // StolenCase Object
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.StolenCase> {
    const path = `/cases`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<models.StolenCase>('POST', path, options, JSON.stringify(args.body));
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  putCases(
    args: {
      body: any,  // StolenCase Object
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.StolenCase> {
    const path = `/cases`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<models.StolenCase>('PUT', path, options, JSON.stringify(args.body));
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getCasesId(
    args: {
      id: number,  // StolenCase with id
    },
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/cases/${args.id}`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  deleteCasesId(
    args: {
      id: number,  // StolenCase with id
    },
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/cases/${args.id}`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('DELETE', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getOfficers(
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/officers`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  postOfficers(
    args: {
      body: any,  // Officers Object
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.Officer> {
    const path = `/officers`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<models.Officer>('POST', path, options, JSON.stringify(args.body));
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  putOfficers(
    args: {
      body: any,  // Officer Object
    },
    requestHttpOptions?: HttpOptions
  ): Observable<models.Officer> {
    const path = `/officers`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<models.Officer>('PUT', path, options, JSON.stringify(args.body));
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getOfficersId(
    args: {
      id: number,  // Officer with id
    },
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/officers/${args.id}`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  deleteOfficersId(
    args: {
      id: number,  // Officer with id
    },
    requestHttpOptions?: HttpOptions
  ): Observable<any> {
    const path = `/officers/${args.id}`;
    const options: APIHttpOptions = {
      ...this.options,
      ...requestHttpOptions,
    };

    return this.sendRequest<any>('DELETE', path, options);
  }

  private sendRequest<T>(method: string, path: string, options: HttpOptions, body?: any): Observable<T> {
    switch (method) {
      case 'DELETE':
        return this.http.delete<T>(`${this.domain}${path}`, options);
      case 'GET':
        return this.http.get<T>(`${this.domain}${path}`, options);
      case 'HEAD':
        return this.http.head<T>(`${this.domain}${path}`, options);
      case 'OPTIONS':
        return this.http.options<T>(`${this.domain}${path}`, options);
      case 'PATCH':
        return this.http.patch<T>(`${this.domain}${path}`, body, options);
      case 'POST':
        return this.http.post<T>(`${this.domain}${path}`, body, options);
      case 'PUT':
        return this.http.put<T>(`${this.domain}${path}`, body, options);
      default:
        console.error(`Unsupported request: ${method}`);
        return throwError(`Unsupported request: ${method}`);
    }
  }
}
