import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Platform } from 'ionic-angular';


const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class PromotionProvider
{

	ipAddress = '192.168.137.1';
	portNo = '8080';
	fullBaseUrl = 'http://' + this.ipAddress + ':' + this.portNo + '/GiftMe-war/Resources/Promotion';

	baseUrl = "/api/Promotion"; //this is for mobile app (to define path)

	constructor(public platform: Platform,
		private httpClient: HttpClient)
	{
		console.log('Hello PromotionProvider Provider');
	}


	email = "";
	password = "";
	loginCredential = "";


	setLoginCredential(email: string, password: string)
	{
		this.email = email;
		this.password = password;
		this.loginCredential = "?email=" + email + "&password=" + password;
	}



	retrieveAllPromotions(): Observable<any>
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

		return this.httpClient.get<any>(path +  "/retrieveAllPromotions").pipe
		(
			catchError(this.handleError)
		);
	}



	retrievePromotionByPromoCode(promoCode: string): Observable<any>
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

		return this.httpClient.get<any>(path + "/retrievePromotion/" + promoCode).pipe
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
