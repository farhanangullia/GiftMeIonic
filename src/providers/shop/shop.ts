import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Platform } from 'ionic-angular';

import { Shop } from '../../entities/shop';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ShopProvider {

  ipAddress = '192.168.137.1';
	portNo = '8080';
	fullBaseUrl = 'http://' + this.ipAddress + ':' + this.portNo + '/GiftMe-war/Resources/Shop';

	baseUrl = "/api/Shop"; //this is for mobile app (to define path)

	constructor(public platform: Platform,
		private httpClient: HttpClient)
	{
		console.log('Hello ShopProvider Provider');
  }

  retrieveAllShops(): Observable<any>
	{
		let path: string = '';

		if(this.platform.is('core') || this.platform.is('mobileweb')) //web app
		{
			path = this.baseUrl;
		}
		else
		{
			path = this.fullBaseUrl; //native mobile app
		}

		return this.httpClient.get<any>(path +  "/retrieveAllShops").pipe
		(
			catchError(this.handleError)
		);

  }

  retrieveShop(shopId: number): Observable<any>
	{
		let path: string = '';

		if(this.platform.is('core') || this.platform.is('mobileweb'))
		{
			path = this.baseUrl;
		}
		else
		{
			path = this.fullBaseUrl;
		}

		return this.httpClient.get<any>(path + "/retrieveShop/" + shopId).pipe
		(
			catchError(this.handleError)
		);
  }

  private handleError(error: HttpErrorResponse)
	{
		if (error.error instanceof ErrorEvent)
		{
			console.error('An unknown error has occurred:', error.error.message);
		}
		else
		{
			console.error(" A HTTP error has occurred: " + `HTTP ${error.status}: ${error.error.message}`);
		}

		return new ErrorObservable(error);
	}
}
