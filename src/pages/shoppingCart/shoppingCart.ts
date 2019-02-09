import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DeliveryPage } from '../delivery/delivery';
import { LoginPage } from '../login/login';
import { RemoteCheckoutLineItem } from '../../entities/remoteCheckoutLineItem';
import { CartProduct } from '../../entities/cartProduct';
//Provider
import { PromotionProvider } from '../../providers/promotion/promotion';

@Component({
  selector: 'page-shopingCart',
  templateUrl: 'shoppingCart.html',
})
export class ShoppingCartPage {

  errorMessage: string;

  isLogin: boolean;
  cartExists: boolean;
  cart: CartProduct[];
  products: any[] = [];
  subtotal: number;
  promoCode: string;
  discount: number;
  deliveryFee: number;
  total: number;
  appliedPromo: boolean = false;
  quantitySelected: string;
  remoteCheckoutLineItems: any[] = [];
  canUpdateQuantity: boolean = false;
  newQuantity: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public promotionProvider: PromotionProvider) {
    this.isLogin=false;
    this.products = [];
    this.subtotal = 0;
    this.promoCode = "";
    this.discount = 0;
    this.deliveryFee = 10;
    this.total = 0;
    this.remoteCheckoutLineItems = new Array<any>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCartPage');

    if (sessionStorage.getItem("isLogin") === null){
      this.navCtrl.push(LoginPage);
    } else {
      this.isLogin = true;

      //if there are items in products in cart
      if (sessionStorage.getItem("Cart") != null && JSON.parse(sessionStorage.getItem("Cart"))[0] != null) {
          this.cartExists = true;

          let sessionStorageItems = JSON.parse(sessionStorage.getItem("Cart"));
          console.log(sessionStorageItems);

          //place sessionStorage cart products into product array
          for (var i = 0; i < sessionStorageItems.length; i++){
            let currentItem = sessionStorageItems[i];
            this.products.push(currentItem);
          }
          console.log("Product", this.products[0]);

          this.calculateSubtotal();
          if (this.subtotal >= 100){
            this.deliveryFee = 0;
          }
          this.calculateTotal();
      }
    }
  }

  removeProduct(productId: number){
    console.log("productId in remove method", productId);
    for (var i =0; i< this.products.length; i++){
      console.log("products[i].product.productId", this.products[i].productId);
      if (this.products[i].product.productId == productId){
        this.products.splice(i,1); //remove 1 item at index i
        console.log(this.products[i]);
      }
    }

    let sessionStorageItems = JSON.parse(sessionStorage.getItem("Cart"));
    console.log(sessionStorageItems);

    let productName = 0;
    for (var j=0; j< sessionStorageItems.length; j++){
      console.log(sessionStorageItems[j].product.productId);
      if (sessionStorageItems[j].product.productId === productId){

        productName = sessionStorageItems[j].product.productName;
        sessionStorageItems.splice(j,1);
        console.log("after remove: SessionStorageItems", sessionStorageItems);
        sessionStorage.setItem("Cart", JSON.stringify(sessionStorageItems));
      }
    }

    let alert = this.alertCtrl.create
    ({
      title: "Remove Product",
      subTitle: productName + " has been removed from Cart successfully",
      buttons: ['OK']
    });
    alert.present();
    if (sessionStorage.getItem("Cart") == null || JSON.parse(sessionStorage.getItem("Cart"))[0] == null) {
      console.log(JSON.parse(sessionStorage.getItem("Cart"))[0]);
      this.cartExists = false;
      console.log("cartExists?",this.cartExists);
      sessionStorage.removeItem("Cart");
    }
    this.calculateSubtotal();
    this.calculateTotal();

  }


  applyPromo(promoCode: string){
    if (!this.appliedPromo){
      this.promotionProvider.retrievePromotionByPromoCode(promoCode).subscribe(
        response => {
          this.discount = response.promotion.discount;
          this.calculateSubtotal();
          this.calculateTotal();
          let alert = this.alertCtrl.create(
            {title: "Apply Promo Code",
            subTitle: promoCode + " has been applied for a discount of $" + this.discount,
            buttons: ['OK']
          });
          alert.present();
          this.appliedPromo = true;
        },
        error => {

          this.errorMessage = "HTTP" + error.status + ": " + error.error.message;

          this.discount = 0;
          this.calculateSubtotal();

          let alert = this.alertCtrl.create(
            {title: "Opps, this code is not valid. Please try again",
            buttons: ['OK']
            });
            alert.present();
        }
      )
    } else {
      let alert = this.alertCtrl.create(
        {title: "Apply Promo Code",
        subTitle: "Promo Code has already been Applied!",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  removePromo(promoCode: string){
    if (this.appliedPromo){      
      this.discount = 0;
      this.calculateSubtotal();
      this.calculateTotal();
      let alert = this.alertCtrl.create(
        {title: "Remove Promo Code",
        subTitle: promoCode + " has been removed succeesfully",
        buttons: ['OK']
      });
      alert.present();
      this.appliedPromo = false;             
      this.promoCode = "";      
    } 
  }

  calculateSubtotal(){

  let subtotal = 0;

  for (var i=0; i< this.products.length; i++){
    let currentProduct = this.products[i];

    console.log(currentProduct);
    subtotal += currentProduct.product.price * currentProduct.quantityInCart;

    console.log("SUBTOTAL", subtotal);
    this.subtotal = subtotal;

    }
    this.subtotal -= this.discount;
  }

  calculateTotal(){
    this.total = this.subtotal + this.deliveryFee;
  }

  updateQuantity(productId: number){
    this.deliveryFee = 10;
    this.canUpdateQuantity = false;
    console.log("productId ", productId);
    //updateQuantity
    for (var i =0; i< this.products.length; i++){
      if (this.products[i].product.productId === productId){
        this.newQuantity = this.products[i].quantityInCart;

        if (this.products[i].quantityInCart < 0) {
          let alert = this.alertCtrl.create({
            title: "Error: Update Quantity",
            subTitle: "Minimum Quantity is 1",
            buttons: ['OK']
          });
          alert.present();
        } else if (this.products[i].quantityInCart == 0){
          let alert = this.alertCtrl.create({
            title: "Error: Update Quantity",
            subTitle: "Minimum Quantity is 1",
            buttons: ['OK']
          });
          alert.present();
        } else {          
          this.canUpdateQuantity = true;
        }
        console.log("CurrentQuantityInCart", this.products[i].quantityInCart);

      }
    }
    if (this.canUpdateQuantity){
      let sessionStorageItems = JSON.parse(sessionStorage.getItem("Cart"));

      for (var j=0; j< sessionStorageItems.length; j++){
        if (sessionStorageItems[j].product.productId === productId){
          let updatedProduct = sessionStorageItems[j];
          updatedProduct.quantityInCart = this.newQuantity;   
          sessionStorageItems[j] = updatedProduct;
          sessionStorage.setItem("Cart", JSON.stringify(sessionStorageItems));
        }
      }
      console.log("edited quantity", sessionStorageItems);
      this.calculateSubtotal();
      if (this.subtotal >= 100){
        this.deliveryFee = 0;
      }
      this.calculateTotal();
      let alert = this.alertCtrl.create(
      {
        title: 'Update Quantity',          
        subTitle: 'Quantity updated Successfully',
        buttons: ['OK']     
      });
      alert.present();
    }
  }

  buttonTapped(event, page) {
    sessionStorage.setItem("PromoCode", this.promoCode);
    this.cart = JSON.parse(sessionStorage.getItem("Cart"));

    for (var i = 0; i < this.cart.length; i++){
      let checkoutItem = new RemoteCheckoutLineItem();
      // let checkoutItem = { skuCode: "FLR001", quantity: 1 };
      checkoutItem.skuCode = this.cart[i].product.skuCode;
      checkoutItem.quantity = this.cart[i].quantityInCart;
      let remoteCheckoutLineItem = new Object();
      remoteCheckoutLineItem = {skuCode: checkoutItem.skuCode, quantity: checkoutItem.quantity};

      let bigObj = {remoteCheckoutLineItem: remoteCheckoutLineItem};

      this.remoteCheckoutLineItems.push(bigObj);
    }
    sessionStorage.setItem("Checkout", JSON.stringify(this.remoteCheckoutLineItems));
    console.log("remote cart ***** " + this.remoteCheckoutLineItems);
  	this.navCtrl.push(DeliveryPage, page);
  }

}
