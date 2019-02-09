import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { Customer } from '../../entities/user';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  submitted: boolean;
  pwUpdated: boolean;
  currentPassword: string;
  updatePassword: FormGroup;
  user: Customer;

  constructor(public navCtrl: NavController, public userProvider: UserProvider,
    public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController,  public frmBuilder: FormBuilder, public loadingCtrl: LoadingController) {
      this.submitted = false;
      this.pwUpdated = false;
      this.currentPassword = "";

      this.updatePassword = this.frmBuilder.group({
  			inputCurrPassword: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])],
  			password: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])],
  			verify: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])]
  		});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  get inputCurrPassword() {
		return this.updatePassword.get("inputCurrPassword");
	}
	get password() {
		return this.updatePassword.get("password");
	}
	get verify() {
		return this.updatePassword.get("verify");
	}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user"));

    this.currentPassword = this.user.password;
    console.log(this.user);
    console.log(this.user.password);
    console.log(this.currentPassword);

    this.updatePassword = this.frmBuilder.group({
      inputCurrPassword: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])],
      password: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])],
      verify: ["", Validators.compose([Validators.maxLength(32), Validators.minLength(4)])]
    });
	}

  changePassword() {
    this.submitted = true;
    this.pwUpdated = false;
    delete this.updatePassword["inputCurrPassword"];

    if (this.updatePassword.valid) {
      let loading = this.loadingCtrl.create({
        content: 'Updating your password, Please wait...',
        spinner: 'bubbles'
      });
      loading.present();

      if (this.updatePassword.value.inputCurrPassword == this.updatePassword.value.password) {        
        loading.dismiss();
        let alert = this.alertCtrl.create(
        {
          title: 'Invalid new password',
          subTitle: 'New Password cannot be the same as current passsword',
          buttons: ['OK']
        });
        alert.present();
      }
      else if ((this.updatePassword.value.inputCurrPassword != this.user.password) && (this.updatePassword.value.password != this.updatePassword.value.verify)) {
        loading.dismiss();
        let alert = this.alertCtrl.create(
        {
          title: 'Current Password',
          subTitle: 'Incorrect current password',
          buttons: ['OK']
        });
        alert.present();

        alert = this.alertCtrl.create(
        {
          title: 'Password Mismatch',
          subTitle: 'Password and verify must be the same',
          buttons: ['OK']
        });
        alert.present();
      } else if (this.updatePassword.value.inputCurrPassword != this.user.password) {
        loading.dismiss();
        let alert = this.alertCtrl.create(
        {
          title: 'Current Password',
          subTitle: 'Incorrect current password',
          buttons: ['OK']
        });
        alert.present();
      } else if (this.updatePassword.value.password != this.updatePassword.value.verify) {
        loading.dismiss();
        let alert = this.alertCtrl.create(
        {
          title: 'Password Mismatch',
          subTitle: 'Password and verify must be the same',
          buttons: ['OK']
        });
        alert.present();
      } else {        
        this.user.password = this.updatePassword.value.password;
        this.userProvider.updateCustomerPassword(this.user).subscribe(
          response => {
            loading.dismiss();
            let toast = this.toastCtrl.create(
            {
              message: 'Password Updated',
              cssClass: 'toast',
              duration: 3000
            });
            toast.present();
            sessionStorage.setItem("user", JSON.stringify(this.user));
            this.pwUpdated = true;
          },
          error => {
            loading.dismiss();
            let alert = this.alertCtrl.create(
            {
              title: 'Password',
              subTitle: 'Invalid password change',
              buttons: ['OK']
            });
            alert.present();
          }
        )
      }
    }
  }

  homeTapped(event, page) {
    this.navCtrl.push(HomePage, page);
  }
}
