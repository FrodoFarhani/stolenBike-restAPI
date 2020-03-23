/* tslint:disable */

import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { DefaultHttpOptions, HttpOptions } from "./";
import { USE_DOMAIN, USE_HTTP_OPTIONS, APIClient } from "./api-client.service";

import * as models from "./models";
import * as guards from "./guards";

/**
 * Created with https://github.com/flowup/api-client-generator
 */
@Injectable()
export class GuardedAPIClient extends APIClient {
	constructor(
		readonly httpClient: HttpClient,
		@Optional() @Inject(USE_DOMAIN) domain?: string,
		@Optional() @Inject(USE_HTTP_OPTIONS) options?: DefaultHttpOptions
	) {
		super(httpClient, domain, options);
	}

	getCases(requestHttpOptions?: HttpOptions): Observable<any> {
		return super
			.getCases(requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}

	postCases(
		args: {
			body: any; // StolenCase Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.StolenCase> {
		return super
			.postCases(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isStolenCase(res) ||
						console.error(
							`TypeGuard for response 'StolenCase' caught inconsistency.`,
							res
						)
				)
			);
	}

	putCases(
		args: {
			body: any; // StolenCase Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.StolenCase> {
		return super
			.putCases(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isStolenCase(res) ||
						console.error(
							`TypeGuard for response 'StolenCase' caught inconsistency.`,
							res
						)
				)
			);
	}

	getCasesId(
		args: {
			id: number; // StolenCase with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any> {
		return super
			.getCasesId(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}

	deleteCasesId(
		args: {
			id: number; // StolenCase with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any> {
		return super
			.deleteCasesId(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}

	getOfficers(requestHttpOptions?: HttpOptions): Observable<any> {
		return super
			.getOfficers(requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}

	postOfficers(
		args: {
			body: any; // Officers Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.Officer> {
		return super
			.postOfficers(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isOfficer(res) ||
						console.error(
							`TypeGuard for response 'Officer' caught inconsistency.`,
							res
						)
				)
			);
	}

	putOfficers(
		args: {
			body: any; // Officer Object
		},
		requestHttpOptions?: HttpOptions
	): Observable<models.Officer> {
		return super
			.putOfficers(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isOfficer(res) ||
						console.error(
							`TypeGuard for response 'Officer' caught inconsistency.`,
							res
						)
				)
			);
	}

	getOfficersId(
		args: {
			id: number; // Officer with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any> {
		return super
			.getOfficersId(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}

	deleteOfficersId(
		args: {
			id: number; // Officer with id
		},
		requestHttpOptions?: HttpOptions
	): Observable<any> {
		return super
			.deleteOfficersId(args, requestHttpOptions)
			.pipe(
				tap(
					(res: any) =>
						guards.isAny(res) ||
						console.error(
							`TypeGuard for response 'Any' caught inconsistency.`,
							res
						)
				)
			);
	}
}
