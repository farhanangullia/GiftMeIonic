import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Platform } from 'ionic-angular';
import { Customer } from '../../entities/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserProvider {
  _user: any = Customer;
  ipAddress = '192.168.137.1';
  portNo = "8080";
  fullBaseUrl = 'http://' + this.ipAddress + ':' + this.portNo + '/GiftMe-war/Resources/Customer';
  baseUrl = "/api/Customer";

  email = "";
  password = "";
  loginCredential = "";
  firstName = "";
  lastName = "";
  mobileNumber = "";

  constructor(public api: Api, public platform: Platform, private httpClient: HttpClient) {
    console.log('Hello UserProvider Provider');
  }

  setLoginCredential(email: string, password: string) {
		this.email = email;
		this.password = password;
		this.loginCredential = "?email=" + email + "&password=" + password;
	}

  getCustomer(email: string, password: string): Observable<any> {
		let path: string = '';
		if(this.platform.is('core') || this.platform.is('mobileweb')) {
			path = this.baseUrl;
		} else {
			path = this.fullBaseUrl;
		}
    console.log(path + "/getCustomer" + "?email=" + email + "&password=" + password);
		return this.httpClient.get<any>(path + "/getCustomer" + "?email=" + email + "&password=" + password).pipe
    (catchError(this.handleError)
		);
  }
  
  forgotPassword(email: string): Observable<any> {
    let path: string = "";
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      path = this.baseUrl;
    } else {
      path = this.fullBaseUrl;
    }

    console.log(path);
    return this.httpClient.get<any>(path + "/forgotPassword?email=" + email).pipe (
      catchError(this.handleError)
    );
  }

  createCustomer(newCustomer: Customer): Observable<any> {
    let path: string = "";
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      path = this.baseUrl;
    } else {
      path = this.fullBaseUrl;
    }
    let createCustomerReq = {
      "customer": newCustomer
    }
    console.log(path);
    console.log(createCustomerReq);
    return this.httpClient.put<any>(path, createCustomerReq, httpOptions).pipe (
      catchError(this.handleError)
    );
  }

  updateCustomer(updateCustomer: Customer): Observable<any> {
    let path: string = "";
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      path = this.baseUrl;
    } else {
      path = this.fullBaseUrl;
    }

    let updateCustomerReq = {
      "customer" : updateCustomer
    }

    return this.httpClient.post<any>(path + "/updateCustomer", updateCustomerReq, httpOptions).pipe (
      catchError(this.handleError)
    );
  }

  updateCustomerPassword(updateCustomer: Customer): Observable<any> {
    let path: string = "";
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      path = this.baseUrl;
    } else {
      path = this.fullBaseUrl;
    }

    let updateCustomerPasswordReq = {
      "customer": updateCustomer
    }

    return this.httpClient.post<any>(path + "/updateCustomerPassword", updateCustomerPasswordReq, httpOptions).pipe (
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			console.error('An unknown error has occurred:', error.error.message);
		} else {
			console.error(" A HTTP error has occurred: " + `HTTP ${error.status}: ${error.error.message}`);
		}
		return new ErrorObservable(error);
  }
}
