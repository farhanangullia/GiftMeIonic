import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//import { AlertController } from 'ionic-angular';
//import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { LoginPage } from '../login/login';

//Provider 
import { ShopProvider } from '../../providers/shop/shop';
import { ProductProvider } from '../../providers/product/product';

import { Shop } from '../../entities/shop';
import { Product } from '../../entities/product';
import { ShopIndivPage } from '../shop-indiv/shop-indiv';
import { ProductIndivPage } from '../product-indiv/product-indiv';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  errorMessage: string;

  shops: Shop[];
  filteredShops: Shop[];
  products: Product[];
  filteredProducts: Product[];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public shopProvider: ShopProvider,
              public productProvider: ProductProvider) {
  }

  @ViewChild(Slides) slides: Slides;

  ionViewDidLoad() {
    this.shopProvider.retrieveAllShops().subscribe(
      response => {        
        this.shops = response.shops;        
        
        this.filteredShops = [];
        for (var i =0; i < this.shops.length; i++){
          if (this.shops[i].shopId === 6 || this.shops[i].shopId === 10 || this.shops[i].shopId === 8 || this.shops[i].shopId === 7){
            this.filteredShops.push(this.shops[i]);
          }
        }
      },
      error => {
        this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
      }
    );
    
    this.productProvider.retrieveAllProducts().subscribe(
			response => {
        this.products = response.products;
        
        this.filteredProducts = [];
        for (var i=0; i <this.products.length;i++){       
          if (this.products[i].productId === 5 || this.products[i].productId === 15 || this.products[i].productId === 26){ 
            this.filteredProducts.push(this.products[i]);
          }
        }        
			},
			error => {
				this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
			}
		);
  }

  goToSlide(){
  	this.slides.slideTo(2, 500);
  }
  
  redirectShop(shopId: number){
    this.navCtrl.push(ShopIndivPage, {
      shopId
    });
  }

  redirectProduct(productId){
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
}
