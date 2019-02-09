import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { ChangePasswordPage } from '../change-password/change-password';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { UserProvider } from '../../providers/user/user';
import { Customer } from '../../entities/user';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit{
	submitted: boolean;
	user: Customer;
  updateUser: Customer;
	isLogin: boolean;
	isUpdated: boolean;
	email: string;
	password: string;
	currFirstName: string;
	currLastName: string;
	currMobileNumber: string;
	updateProfile: FormGroup;
	updateProfileErrorMessage: string;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public toastCtrl: ToastController,
				public alertCtrl: AlertController, public userProvider: UserProvider, public frmBuilder: FormBuilder, public loadingCtrl: LoadingController) {
		this.submitted = false;
		this.isUpdated = false;
		this.currFirstName = "";
		this.currLastName = "";
		this.currMobileNumber = "";
		this.email = "";

		this.updateProfile = this.frmBuilder.group({
			firstName: ["", Validators.required],
			lastName: ["", Validators.required],
			mobileNumber: ["", [Validators.minLength(8), Validators.maxLength(8)]]
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilePage');
	}

	get firstName() {
		return this.updateProfile.get("firstName");
	}
	get lastName() {
		return this.updateProfile.get("lastName");
	}
	get mobileNumber() {
		return this.updateProfile.get("mobileNumber");
	}

	ngOnInit() {
		if (sessionStorage.getItem("isLogin") !== null) {
			this.isLogin = true;
			this.user = JSON.parse(sessionStorage.getItem("user"));

			this.currFirstName = this.user.firstName;
			this.currLastName = this.user.lastName;
			this.currMobileNumber = this.user.mobileNumber;
			this.email = this.user.email;
			console.log(this.user);

			this.updateProfile = this.frmBuilder.group({
        firstName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],
        lastName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],
        mobileNumber: [
          "",
          [Validators.minLength(8), Validators.maxLength(8)]
        ]
      });
			this.updateProfileErrorMessage = "";

			console.log(this.updateProfile.value.firstName);
			console.log(this.user.firstName);
		} else {
			this.navCtrl.push(LoginPage);
		}
	}

	update() {
		this.submitted = true;
		console.log(this.email);
		if (this.updateProfile.valid) {
			if (isNaN(this.updateProfile.value.mobileNumber)) {
				let alert = this.alertCtrl.create(
				{
					title: 'Invalid Mobile Number',
					subTitle: 'Mobile number can only contain numbers',
					buttons: ['OK']
				});
				alert.present();
			} else {
				let loading = this.loadingCtrl.create({
          content: 'Updating your profile, Please wait...',
          spinner: 'bubbles'
        });
        loading.present();

				this.isUpdated = true;

				this.user.firstName = this.updateProfile.value.firstName;
				this.user.lastName = this.updateProfile.value.lastName;
				this.user.mobileNumber = this.updateProfile.value.mobileNumber;
				console.log("updated user " + this.user);

	      sessionStorage.setItem("user", JSON.stringify(this.user));

				console.log("updated " + this.updateProfile.value.firstName);
				console.log("updated " + this.user.firstName);
				this.userProvider.updateCustomer(this.user).subscribe(
					response => {
						loading.dismiss();
						let toast = this.toastCtrl.create(
						{
							message: 'Details Updated',
							cssClass: 'toast',
							duration: 3000
						});
						toast.present();
	          console.log("updated name: " + this.user.firstName);

						sessionStorage.setItem("user", JSON.stringify(this.user));
					},
					error => {
						loading.dismiss();
						//this.errorMessage = "HTTP " + error.status + ":" + error.error.message;
						let alert = this.alertCtrl.create(
						{
							title: 'Profile',
							subTitle: 'Invalid profile details',
							buttons: ['OK']
						});
						alert.present();
					}
				);
			}
		}
	}

	cartTapped(event, page) {
    if (sessionStorage.getItem("isLogin")=== null) {
      this.navCtrl.push(LoginPage);
      let toast = this.toastCtrl.create({
        message: 'Error: Please Login to view Cart',
        cssClass: 'toast',
        duration: 3000
      });
      toast.present();
    } else {
    this.navCtrl.push(ShoppingCartPage, page);
    }
	}

	buttonTapped(event, page) {
		this.navCtrl.push(ChangePasswordPage, page);
	}

	homeTapped(event, page) {
    this.navCtrl.push(HomePage, page);
  }
}
