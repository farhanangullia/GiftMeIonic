import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { LoginPage } from '../login/login';

//Provider 
import { ShopProvider } from '../../providers/shop/shop';

import { Shop } from '../../entities/shop';
import { ShopIndivPage } from '../shop-indiv/shop-indiv';
import { getTypeNameForDebugging } from '@angular/core/src/change_detection/differs/iterable_differs';

@Component({
  selector: 'page-shops',
  templateUrl: 'shops.html',
})
export class ShopsPage {

  errorMessage: string;
  shops: Shop[];

  areaFilteredShops: Shop[];
  areas: any;

  constructor(public navCtrl: NavController, 
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public shopProvider: ShopProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopsPage');

    this.areas = [
      {area: "Central", checked: false}, 
      {area: "East", checked: false}, 
      {area: "North", checked: false},
      {area: "South", checked: false},
      {area: "West", checked: false}
    ];

    this.shopProvider.retrieveAllShops().subscribe(
      response => {        
        this.shops = response.shops;        
        this.areaFilteredShops = this.shops;
      },
      error => {
        this.errorMessage = "HTTP " + error.status + ": " + error.error.message;
      }
    );                    
    
  }

  filterByArea(event, area: string){
    //always reset areaFilteredShops    
    this.areaFilteredShops = [];

    console.log("this.shops", this.shops);
    let contains = false;

    for (var i = 0; i < this.areas.length; i++) {      
      if (area === this.areas[i].area){
        console.log("areas matched", this.areas[i].area);
        if (event.checked == true){
          console.log("eventChecked",event.checked);
          this.areas[i].checked = true;
          console.log(this.areas[i].area, this.areas[i].checked);
        } else if (event.checked == false) {
            console.log("eventChecked",event.checked);
            this.areas[i].checked = false;
            console.log(this.areas[i].area, this.areas[i].checked);        
        }
      }
    }

    for (var i =0; i < this.areas.length; i++){
      if (this.areas[i].checked == true){
        console.log("print those true",this.areas[i].area);
        for (var j =0; j < this.shops.length; j++){
          if (this.shops[j].area == this.areas[i].area){
            this.areaFilteredShops.push(this.shops[j]);
            console.log(this.areaFilteredShops);
          }
        }        
      }
    }
    
  }

  viewShop(shopId){
    console.log("passedinSHopId",shopId);
    this.navCtrl.push(ShopIndivPage, {
      shopId
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