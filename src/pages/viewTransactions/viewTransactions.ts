import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { Customer } from '../../entities/user';
import { Transaction } from '../../entities/transaction';
import { TransactionIndivPage } from '../transaction-indiv/transaction-indiv';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-viewTransactions',
  templateUrl: 'viewTransactions.html',
})
export class ViewTransactionsPage {
  user: Customer;
  transactions: Transaction[];
  errorMessage: string;
  isLogin: boolean;
  hasTransactions: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public transactionProvider: TransactionProvider, public toastCtrl: ToastController) {
    this.transactions = new Array<Transaction>();
    this.isLogin = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTransactionsPage');
    this.hasTransactions = true;
    if (sessionStorage.getItem("isLogin") !== null) {
      this.isLogin = true;
      this.user = JSON.parse(sessionStorage.getItem("user"));
      console.log("this user email " + this.user.email);

      this.transactionProvider.retrieveAllTransactionsByEmail(this.user.email).subscribe(
        response => {
          this.transactions = response.transactions;
          console.log("All transactions ", this.transactions);   
          if (this.transactions.length === 0){
            this.hasTransactions = false;                        
          }
          console.log(this.hasTransactions);
          if (this.hasTransactions){
            for (var i = 0; i < response.transactions.length; i++) {
              this.hasTransactions = true;
              let transaction = new Transaction();
              transaction.transactionDateTime = new Date(response.transactions[i].transactionDateTime);
              let transactionDateString = transaction.transactionDateTime.toString();
              console.log("date time " + transactionDateString);
              transaction.transactionDatePurchased = transactionDateString.substring(0, 24);

              transaction.transactionDeliveryCode = response.transactions[i].delivery.deliveryCode;
              transaction.transactionStatus = response.transactions[i].delivery.deliveryStatus;
              transaction.transactionTotal = response.transactions[i].totalAmount;
              this.transactions[i] = transaction;

              console.log('this transactions', this.transactions);
            }
          }
        },
        error => {
          this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
        });    
    } else {
      this.navCtrl.push(LoginPage);
    }
  }

  indivTransaction(transactionDeliveryCode) {
    console.log(transactionDeliveryCode);
    this.navCtrl.push(TransactionIndivPage, {transactionDeliveryCode});
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
