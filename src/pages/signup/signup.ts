import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { Customer } from '../../entities/user';
import { EmailDirective } from '../../providers/validator/validator';
import { NgForm, PatternValidator, FormGroup, FormBuilder, Validators, EmailValidator} from "@angular/forms";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  submitted: boolean;
  newUser: Customer;
  register: FormGroup;
  registerErrorMessage: string;
  mobnumPattern: string;
  mobileRegEx: RegExp;
  emailPattern: any;


  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController, public userProvider: UserProvider, public alertCtrl: AlertController, private frmBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    this.submitted = false;
    this.newUser = new Customer();
    // this.mobileRegEx = new RegExp(/(8|9)\d{1,7}/);
    // this.mobnumPattern = this.mobileRegEx.toString();
    this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }

  ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}

  get firstName() {
    return this.register.get("firstName");
  }
  get lastName() {
    return this.register.get("lastName");
  }
  get mobileNumber() {
    return this.register.get("mobileNumber");
  }
  get email() {
    return this.register.get("email");
  }
  get password() {
    return this.register.get("password");
  }
  get verify() {
    return this.register.get("verify");
  }

  ngOnInit() {
    this.register = this.frmBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      mobileNumber: ["",[Validators.required]],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ["", [Validators.required]],
      verify: ["", [Validators.required]]
    });

    this.registerErrorMessage = "";
  }

  signup() {
    this.submitted = true;
    //delete this.register["verify"];
    //console.log(this.register.value);
    if (this.register.valid) {
      if ((this.register.value.password !== this.register.value.verify) && isNaN(this.register.value.mobileNumber)) { //password mismatch
        let alert = this.alertCtrl.create(
        {
          title: 'Password Mismatch',
          subTitle: 'Password and verify must be the same',
          buttons: ['OK']
        });
        alert.present();

        alert = this.alertCtrl.create(
        {
          title: 'Invalid Mobile Number',
          subTitle: 'Mobile number can only contain numbers',
          buttons: ['OK']
        });
        alert.present();
      } else if (isNaN(this.register.value.mobileNumber)) {
        let alert = this.alertCtrl.create(
        {
          title: 'Invalid Mobile Number',
          subTitle: 'Mobile number can only contain numbers',
          buttons: ['OK']
        });
        alert.present();
      } else if (this.register.value.password !== this.register.value.verify) {
        let alert = this.alertCtrl.create(
        {
          title: 'Password Mismatch',
          subTitle: 'Password and verify must be the same',
          buttons: ['OK']
        });
        alert.present();
      } else { //password match
        let loading = this.loadingCtrl.create({
          content: 'Signing you up, Please wait...',
          spinner: 'bubbles'
        });
        loading.present();

        console.log("form is valid");

        this.userProvider.createCustomer(this.register.value).subscribe (
          response => {
            loading.dismiss();
            console.log("this.newUser",this.newUser);
            this.newUser.firstName = this.register.value.firstName;
            this.newUser.lastName = this.register.value.lastName;
            this.newUser.email = this.register.value.email;
            this.newUser.password = this.register.value.password;
            this.newUser.mobileNumber = this.register.value.mobileNumber;
              sessionStorage.setItem("user", JSON.stringify(this.newUser));
              sessionStorage.setItem("isLogin", this.newUser.email);
              let toast = this.toastCtrl.create({
                message: 'Sign up is Successful!',
                cssClass: 'toast',
                duration: 3000,
              });
              toast.present();
              this.navCtrl.push(HomePage);
              console.log(this.newUser + " successful");
          },
          error => {
            loading.dismiss();
            let alert = this.alertCtrl.create(
      			{
      				title: 'Register',
      				subTitle: 'Account already exists or Invalid details entered',
      				buttons: ['OK']
      			});
      			alert.present();
          }
        )
      }
    }
  }
}
