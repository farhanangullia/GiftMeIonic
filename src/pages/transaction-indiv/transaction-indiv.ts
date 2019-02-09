import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Customer } from '../../entities/user';
import { Product } from '../../entities/product';
import { Transaction } from '../../entities/transaction';

import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { LoginPage } from '../login/login';

import { TransactionProvider } from '../../providers/transaction/transaction';

@Component({
  selector: 'page-transaction-indiv',
  templateUrl: 'transaction-indiv.html',
})
export class TransactionIndivPage {
  currProduct: Product;
  products: Product[];
  deliveryCode: string;
  quantity: number;
  price: number;
  address: string;
  discount: number;
  totalAmount: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public transactionProvider: TransactionProvider, 
              public toastCtrl: ToastController) {                
    this.deliveryCode = this.navParams.get('transactionDeliveryCode');
    this.products = new Array<Product>();
    this.discount = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionIndivPage');
    console.log("Delivery code " + this.deliveryCode);

    this.transactionProvider.retrieveTransactionByDeliveryCode(this.deliveryCode).subscribe(
      response => {
        this.address = response.transaction.delivery.customerAddress;
        console.log("this address", this.address);

        this.discount = response.transaction.discount;
        this.totalAmount = response.transaction.totalAmount;

        let transactionLineItems = response.transaction.transactionLineItems;
        console.log(transactionLineItems);
        for (var i = 0; i < transactionLineItems.length; i++) {
          this.products[i] = transactionLineItems[i];
          this.currProduct = transactionLineItems[i].product;
          console.log("current product " + this.currProduct);
          this.quantity = transactionLineItems[i].quantity;
          console.log("product quantity " + this.quantity);
          this.price = this.currProduct.price;
          console.log("product price " + this.price);
        }
      },
      error => {
        console.log("error loading products");
      }
    )
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
