import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  submitted: boolean;
  email: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public userProvider: UserProvider) {
    this.submitted = false;
    this.email = "";                    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
       
  resetPw(forgotPw: NgForm){
    this.submitted = true;
    if (forgotPw.valid){
      let loading = this.loadingCtrl.create({
        content: 'Login now, Please wait...',
        spinner: 'bubbles'
      });
      loading.present();
    
      this.userProvider.forgotPassword(this.email).subscribe (
        reponse => {
          loading.dismiss();
          let alert = this.alertCtrl.create(
          {
            title: 'Password Reset Request',
            subTitle: 'We\'ve sent a password retrieval message to your email address. Please check your Email.',
            buttons: ['OK']
          });
          alert.present();
        },
        error => {
          loading.dismiss();
          let alert = this.alertCtrl.create(
          {
            title: 'Password Reset Request',
            subTitle: 'Invalid Email',
            buttons: ['OK']
          });
          alert.present();
        }
      )
    }
  }
}
