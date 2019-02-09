import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { ProductIndivPage } from '../product-indiv/product-indiv';
import { ViewReviewsPage } from '../view-reviews/view-reviews';
import { LoginPage } from '../login/login';

//Provider
import { ShopProvider } from '../../providers/shop/shop';

import { Shop } from '../../entities/shop';
import { Product } from '../../entities/product';

@Component({
  selector: 'page-shop-indiv',
  templateUrl: 'shop-indiv.html',
})
export class ShopIndivPage {

  errorMessage: string;

  shopId: number;
  shopToView: Shop;
  products: Product;

  constructor(public navCtrl: NavController, 
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public shopProvider: ShopProvider) 
  {
    this.shopId = this.navParams.get('shopId');    
    console.log("receivedShopid", this.shopId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopIndivPage');

    this.shopProvider.retrieveShop(this.shopId).subscribe(
      response => {
        
        this.shopToView = response.shop;        
        this.products = this.shopToView.products;
        console.log(this.shopToView);
        console.log(this.shopToView.imgPath);
        console.log(this.products);
      },
      
      error => {
        this.errorMessage = "HTTP" + error.status + ": " + error.error.message;
      }
    );        
  }
  
  viewProduct(productId){
    console.log(productId)
    this.navCtrl.push(ProductIndivPage, {
      productId
    });
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

  viewReview(event, shopId) {
  	this.navCtrl.push(ViewReviewsPage, {
      shopId
    });
  }
}
