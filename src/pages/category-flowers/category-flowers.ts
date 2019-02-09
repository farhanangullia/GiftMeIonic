import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { ProductIndivPage } from '../product-indiv/product-indiv';
import { LoginPage } from '../login/login';

//Provider
import { ProductProvider } from '../../providers/product/product';

import { Product } from '../../entities/product';

@Component({
  selector: 'page-category-flowers',
  templateUrl: 'category-flowers.html',
})
export class CatFlowersPage {

  errorMessage: string;
  products: Product[];  
  filteredProducts: Product[];

  maxPrice: number = 1;
  prices: any[] = [];

  priceFilterMin: any;
  priceFilterMax: any;
  priceFilteredProducts: Product[];

  priceFilter: any= {
    upper:this.maxPrice,
    lower:1
  }
  
  colours: any;  

  colorFilteredProducts: Product[];
  finalFilteredProducts: Product[];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
  						public navParams: NavParams,
  						public productProvider: ProductProvider) {      
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryFlowersPage');

    this.priceFilteredProducts = [];
    this.colorFilteredProducts = [];
    this.filteredProducts = [];

    this.colours = [
      {colour:"Red", checked: false}, 
      {colour:"Blue", checked: false},
      {colour:"Yellow", checked: false},
      {colour:"White", checked: false}
    ];    

    this.productProvider.retrieveAllProducts().subscribe(
			response => {        
        this.products = response.products;

        for (var i=0; i < this.products.length; i++){         
          if (this.products[i].category === "Flowers"){
            let productToPush = this.products[i];
            this.filteredProducts.push(productToPush);
            this.prices.push(this.products[i].price);
          }          
        }
        
        this.priceFilteredProducts = this.filteredProducts;   
        console.log("pricefiltered",this.priceFilteredProducts);
        this.calculateMax();
        this.priceFilter.upper = this.maxPrice;
        this.colorFilteredProducts = this.filteredProducts;
        this.finalFilteredProducts = this.filteredProducts;
			},
			error => {
				this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
			}
		);
  }

  calculateMax() {
    this.maxPrice = this.prices.reduce(function(a,b) {
      return Math.max(a,b);
    });
    console.log(this.maxPrice);
    this.priceFilterMax = this.priceFilter.upper;
  }

  filterProductByPrice(){
    //always reset filteredProducts  
    this.priceFilteredProducts = [];        
    
    this.priceFilterMin = this.priceFilter.lower;
    this.priceFilterMax = this.priceFilter.upper;
    
    for (var i =0; i < this.filteredProducts.length; i++){
      if (this.filteredProducts[i].price >= this.priceFilterMin && this.filteredProducts[i].price <= this.priceFilterMax){
        this.priceFilteredProducts.push(this.filteredProducts[i]);
      }
    }        
  }
  
  colourSelected(event, colour: string){
    //reset colour array
    this.colorFilteredProducts = [];    
    
    for (var i =0; i <this.colours.length; i++){
      if (this.colours[i].colour == colour && event.checked == true){
        this.colours[i].checked = true;
      } else if (this.colours[i].colour == colour && event.checked == false) {
        this.colours[i].checked = false;
      }
    }    

    for (var i =0; i < this.colours.length; i++){
      if (this.colours[i].checked == true){
        for (var j =0; j<this.products.length; j++){
          if (this.products[i].colour == this.colours[i].colours){
            this.colorFilteredProducts.push(this.products[i]);
          }
        }
      }
    }
    console.log("colorFilteredProduct",this.colorFilteredProducts);    
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
}
