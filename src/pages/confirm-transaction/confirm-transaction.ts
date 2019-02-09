import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-confirm-transaction',
  templateUrl: 'confirm-transaction.html',
})
export class ConfirmTransactionPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmTransactionPage');  
  }

  homeTapped($event, page){
    this.navCtrl.push(HomePage);
  }
}
