/* tslint:disable */

import { Observable } from "rxjs";
import { HttpOptions } from "./";
import * as models from "./models";

export interface APIClientInterface {
	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	getCases(requestHttpOptions?: HttpOptions): Observable<any>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	postCases(
		args: {
			body: any; // StolenCase Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.StolenCase>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	putCases(
		args: {
			body: any; // StolenCase Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.StolenCase>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	getCasesId(
		args: {
			id: number; // StolenCase with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	deleteCasesId(
		args: {
			id: number; // StolenCase with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	getOfficers(requestHttpOptions?: HttpOptions): Observable<any>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	postOfficers(
		args: {
			body: any; // Officers Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.Officer>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	putOfficers(
		args: {
			body: any; // Officer Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.Officer>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	getOfficersId(
		args: {
			id: number; // Officer with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any>;

	/**
	 * Response generated for [ 200 ] HTTP response code.
	 */
	deleteOfficersId(
		args: {
			id: number; // Officer with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any>;
}
