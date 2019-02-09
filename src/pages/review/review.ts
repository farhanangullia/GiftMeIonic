import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController, AlertController } from 'ionic-angular';
import { ReviewProvider } from '../../providers/review/review';
import { Review } from '../../entities/review';
import { Customer } from '../../entities/user';
import { Transaction } from '../../entities/transaction';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";

@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  submitted: boolean;
	user: Customer;
	isLogin: boolean;
	isSent: boolean;
  inputCustName: string;
  custEmail: string;
  transactions: Transaction[];
  createReview: FormGroup;
  shopId: number;
  createReviewErrorMessage: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController, 
              public reviewProvider: ReviewProvider, 
              public frmBuilder: FormBuilder, 
              public toastCtrl: ToastController) {
    this.submitted = false;
		this.isSent = false;
		this.inputCustName = "";
    this.shopId = navParams.get("shopId");  

    this.createReview = this.frmBuilder.group({
      comment: ["", [Validators.required]],
      rating: ["", Validators.required],
      title: ["", Validators.required],
      customerName: [""]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }

  get comment() {
    return this.createReview.get("comment");
   }
   get rating() {
     return this.createReview.get("rating");
   }
   get title() {
     return this.createReview.get("title");
   }
   get customerName() {
     return this.createReview.get("customerName");
   }

  ngOnInit() {
    if (sessionStorage.getItem("isLogin") !== null) {
      this.isLogin = true;
			this.user = JSON.parse(sessionStorage.getItem("user"));
      this.custEmail = this.user.email;
      this.inputCustName = this.user.firstName;
      console.log(this.inputCustName, this.user.firstName);

      // Retrieve all transactions from customer to be added
      this.createReview.value.customerName = this.inputCustName;
      console.log("Review formm values", this.createReview.value);

      this.createReview = this.frmBuilder.group({
        comment: ["", [Validators.required]],
        rating: ["", Validators.required],
        title: ["", Validators.required],
        customerName: [this.inputCustName]
      });

      this.createReviewErrorMessage = "";
    } else {
      this.navCtrl.push(LoginPage);
      let toast = this.toastCtrl.create({
        message: 'Error: Please Login to view Shop Reviews',
        cssClass: 'toast',
        duration: 3000
      });
      toast.present();      
    }
  }

  sendReview() {
    this.submitted = true;

    if(this.createReview.valid) {
      this.isSent = true;

      this.reviewProvider.createReview(this.createReview.value, this.shopId).subscribe(
        response => {
          console.log("review sent");
        },
        error => {
          let alert = this.alertCtrl.create(
					{
						title: 'Review',
						subTitle: 'Response not recorded',
						buttons: ['OK']
					});
					alert.present();
        }
      )
    }
  }

  homeTapped(event, page) {
    this.navCtrl.push(HomePage, page);
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
}
