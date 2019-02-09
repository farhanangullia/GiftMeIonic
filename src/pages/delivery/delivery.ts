import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from 'ionic-angular';
import { RemoteCheckoutLineItem } from '../../entities/remoteCheckoutLineItem';
import { CartProduct } from '../../entities/cartProduct';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { HomePage } from '../home/home';
import { Customer } from '../../entities/user';
import { ConfirmTransactionPage } from '../confirm-transaction/confirm-transaction';

@Component({
  selector: 'page-delivery',
  templateUrl: 'delivery.html',
})

export class DeliveryPage {
  submitted: boolean;
  updateCheckout: boolean;
  customerAddress: string;
  shopAddress: string;
  promoCode: string;
  email: string;
  user: Customer;
  updateDelivery: FormGroup;
  remoteCheckoutLineItems: RemoteCheckoutLineItem[];
  cart: CartProduct[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController, 
              public frmBuilder: FormBuilder, 
              public transactionProvider: TransactionProvider) 
  {
    this.submitted = false;
    this.updateCheckout = false;
    this.cart = new Array<CartProduct>();
    this.remoteCheckoutLineItems = new Array<RemoteCheckoutLineItem>();

    this.updateDelivery = this.frmBuilder.group({
      address: ["", [Validators.required]],
      nameOnCard: ["", [Validators.required]],
      cardNumber: ["", [Validators.required]],
      expiryDate: ["", [Validators.required]],
      cvv: ["", [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryPage');
  }

  get address() {
    return this.updateDelivery.get('address');
  }
  get nameOnCard() {
    return this.updateDelivery.get('nameOnCard');
  }
  get cardNumber() {
    return this.updateDelivery.get('cardNumber');
  }
  get expiryDate() {
    return this.updateDelivery.get('expiryDate');
  }
  get cvv() {
    return this.updateDelivery.get('cvv');
  }

  ngOnInit() {
    this.cart = JSON.parse(sessionStorage.getItem("Cart"));
    this.remoteCheckoutLineItems = JSON.parse(sessionStorage.getItem("Checkout"));
    console.log(this.remoteCheckoutLineItems);
    this.shopAddress = this.cart[0].product.shop.location;
    this.promoCode = sessionStorage.getItem("PromoCode");
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.email = this.user.email;

    this.updateDelivery = this.frmBuilder.group({
      address: ["", [Validators.required]],
      nameOnCard: ["", [Validators.required]],
      cardNumber: ["", [Validators.required]],
      expiryDate: ["", [Validators.required]],
      cvv: ["", [Validators.required]]
    });
  }

  updateDev() {
    this.submitted = true;
    this.updateCheckout = false;
    console.log(this.remoteCheckoutLineItems);
    if (this.updateDelivery.valid) {
      if (isNaN(this.updateDelivery.value.cardNumber) && isNaN(this.updateDelivery.value.cvv)) {
        let alert = this.alertCtrl.create(
        {
          title: 'Invalid Card Number',
          subTitle: 'Card number can only contain numbers',
          buttons: ['OK']
        });
        alert.present();

        alert = this.alertCtrl.create(
        {
          title: 'Invalid CVV',
          subTitle: 'CVV can only contain numbers',
          buttons: ['OK']
        });
        alert.present();
      } else if (isNaN(this.updateDelivery.value.cvv)) {
        let alert = this.alertCtrl.create(
        {
          title: 'Invalid CVV',
          subTitle: 'CVV can only contain numbers',
          buttons: ['OK']
        });
        alert.present();
      } else if (isNaN(this.updateDelivery.value.cardNumber)) {
        let alert = this.alertCtrl.create(
        {
          title: 'Invalid Card Number',
          subTitle: 'Card number can only contain numbers',
          buttons: ['OK']
        });
        alert.present();
      } else {        
        this.customerAddress = this.updateDelivery.value.address;
        this.updateCheckout = false;
        this.transactionProvider.remoteCheckout(this.remoteCheckoutLineItems, this.promoCode, this.email, this.customerAddress, this.shopAddress).subscribe(
  				response => {
            this.updateCheckout = true;
            let toast = this.toastCtrl.create(
  					{
  						message: 'Payment Successful',
  						cssClass: 'toast',
  						duration: 3000
  					});
  					toast.present();
            
            sessionStorage.removeItem("Cart");
            this.navCtrl.push(ConfirmTransactionPage);
  				},
  				error => {
            //this.errorMessage = "HTTP " + error.status + ":" + error.error.message;            
  					let alert = this.alertCtrl.create(
  					{
  						title: 'Delivery/Payment',
  						subTitle: 'Invalid details',
  						buttons: ['OK']
  					});
  					alert.present();  					
  				}
  			);
      }
    }
  }

  // homeTapped(event, page) {
  //   this.navCtrl.push(HomePage, page);
  // }

  // buttonTapped(event, page) {
  // 	this.navCtrl.push(ConfirmTransactionPage, page);
  // }
}
