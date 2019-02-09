import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AlertController, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { UserProvider } from '../../providers/user/user';
import { Customer } from '../../entities/user';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

	submitted: boolean;
  isLogin: boolean;
	email: string;
	password: string;
  user: Customer;
	loginCredential: string;
	firstName: string;

	constructor(public navCtrl: NavController,
  						public alertCtrl: AlertController,
							public navParams: NavParams,
							public toastCtrl: ToastController,
							public userProvider: UserProvider,
							public loadingCtrl: LoadingController)
	{
	  this.submitted = false;
    this.loginCredential = "";
 	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
    if (sessionStorage.getItem("isLogin") !== null) {
			this.isLogin = true;
			this.user = JSON.parse(sessionStorage.getItem("user"));
			this.firstName = this.user.firstName;
    }
	}

	login(loginForm: NgForm) {
		this.submitted = true;
    //try to get customer if valid and catch any error
    if (loginForm.valid) {
			let loading = this.loadingCtrl.create({
				content: 'Login now, Please wait...',
				spinner: 'bubbles'
      });
      loading.present();

      this.userProvider.getCustomer(this.email, this.password).subscribe (
        response => {
          loading.dismiss();
          console.log(this.email);
          this.user = response.customer;
          this.user.password = this.password;
          sessionStorage.setItem("user", JSON.stringify(this.user));
					console.log(sessionStorage.getItem("user"));
					this.firstName = this.user.firstName;
					console.log(this.firstName);

          this.isLogin = true;
          sessionStorage.setItem("isLogin", this.email);

          let toast = this.toastCtrl.create({
  					message: 'Log in Successful. Welcome back',
  					cssClass: 'toast',
  					duration: 3000
  				});
					toast.present();
					this.navCtrl.setRoot(HomePage);
        },
        error => {
          loading.dismiss();
          let alert = this.alertCtrl.create(
    			{
    				title: 'Login',
    				subTitle: 'Invalid login details',
    				buttons: ['OK']
    			});
    			alert.present();
        }
      )
    }
	}

	logout(){
		console.log("Logout");
		sessionStorage.clear();
		this.navCtrl.setRoot(HomePage);

		let toast = this.toastCtrl.create(
		{
			message: 'Logout Successful.',
			cssClass: 'toast',
			duration: 3000
		});

		toast.present();
	}

	register(event, page){
		this.navCtrl.push(SignupPage, page);
	}

	getPassword(event, page){
		this.navCtrl.push(ForgotPasswordPage, page);
	}
}
