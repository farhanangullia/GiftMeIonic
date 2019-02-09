//Angular
import { Component, ViewChild } from '@angular/core';

//Ionic
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController, AlertController } from 'ionic-angular';

//Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ViewTransactionsPage } from '../pages/viewTransactions/viewTransactions';
import { ShopsPage } from '../pages/shops/shops';
//import { ShopIndivPage } from '../pages/shop-indiv/shop-indiv';
import { ProductIndivPage } from '../pages/product-indiv/product-indiv';
import { ShoppingCartPage } from '../pages/shoppingCart/shoppingCart';
import { ReviewPage } from '../pages/review/review';
import { CatConfectionaryPage } from '../pages/category-confectionery/category-confectionery';
import { CatFlowersPage } from '../pages/category-flowers/category-flowers';
import { CatPlushiesPage } from '../pages/category-plushies/category-plushies';


//Side Menu Component
import { SideMenuContentComponent } from '../pages/side-menu-content/side-menu-content.component';
import { MenuOptionModel } from '../pages/side-menu-content/models/menu-option-model';
import { SideMenuSettings } from '../pages/side-menu-content/models/side-menu-settings';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  //@viewchild: to get access to component and methods
  @ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

  rootPage: any = HomePage;

  // Options to show in the SideMenuComponent
  options: Array<MenuOptionModel>;

  // Settings for the SideMenuComponent
  public sideMenuSettings: SideMenuSettings = {
    accordionMode: true,
    showSelectedOption: true,
    selectedOptionClass: 'active-side-menu-option',
    subOptionIndentation: {
      md: '56px',
      ios: '64px',
      wp: '56px'
    }
  };

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,          
              private menuCtrl: MenuController)
  {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Initialize some options
      this.initializeOptions();
    });
  }

  private initializeOptions(): void {
    this.options = new Array<MenuOptionModel>();

    // Load simple menu options
    // ------------------------------------------
    this.options.push({
      iconName: 'home',
      displayName: 'Home',
      component: HomePage,

      // This option is already selected
      selected: true
    });


    // Load options with nested items
    // -----------------------------------------------
    this.options.push({
      displayName: 'Profile',
      subItems: [
        {
          iconName: 'person',
          displayName: 'Manage Profile',
          component: ProfilePage,
          custom: {
            clickedProfile: true
          }
        },
        {
          iconName: 'basket',
          displayName: 'View Transactions',
          component: ViewTransactionsPage,
          custom: {
            clickedTransaction: true
          }
        }
      ]
    });

    this.options.push({
      displayName: 'Product',
      subItems: [
        {
          iconName: 'flower',
          displayName: 'Flowers',
          component: CatFlowersPage
        },
        {
          iconName: 'ice-cream',
          displayName: 'Confectionery',
          component: CatConfectionaryPage
        },
        {
          iconName: 'basket',
          displayName: 'Plushies',
          component: CatPlushiesPage
        }
      ]
    });

    this.options.push({
      displayName: 'Shop',
      subItems: [
        {
          iconName: 'pin',
          displayName: 'Location',
          component: ShopsPage
        }
      ]
    });

    this.options.push({
      iconName: 'cart',
      displayName: 'Shopping Cart',
      component: ShoppingCartPage, 
      custom: {
        clickedCart: true
      }     
    });

    // Load special options
    // -----------------------------------------------
    this.options.push({
      iconName: 'log-in',
      displayName: 'Login',
      component: LoginPage,
      custom: {
        clickedLogin: true
      }
    });

    this.options.push({
      iconName: 'log-out',
      displayName: 'Logout',
      component: LoginPage,
      custom: {
        clickedLogout: true
      }
    });

  }

  public selectOption(option: MenuOptionModel): void {
    this.menuCtrl.close().then(() => {
      console.log(sessionStorage.getItem("user"));
      if (option.custom && option.custom.clickedLogin && sessionStorage.getItem("user") !== null) {        
        let alert = this.alertCtrl.create(
        {
          title: 'Login',
          subTitle: 'You are already logged In!',
          buttons: ['OK']
        });
        alert.present();      
      } else if (option.custom && option.custom.clickedLogout && sessionStorage.getItem("user") === null) {        
        let alert = this.alertCtrl.create(
        {
          title: 'Logout',
          subTitle: 'You are not logged in, please click on Login instead!',
          buttons: ['OK']
        });
        alert.present();
      } else if (option.custom && option.custom.clickedCart && sessionStorage.getItem("user") === null){
        if (sessionStorage.getItem("Cart")=== null) {
          this.navCtrl.setRoot(LoginPage);
          let toast = this.toastCtrl.create({
            message: 'Error: Please Login to view Shopping Cart',
            cssClass: 'toast',
            duration: 3000
          });
          toast.present();
        }
      } else if (option.custom && option.custom.clickedTransaction && sessionStorage.getItem("user") === null) {
        this.navCtrl.setRoot(LoginPage);
        let toast = this.toastCtrl.create({
          message: 'Error: Please Login to view Transactions',
          cssClass: 'toast',
          duration: 3000
        });
        toast.present();      
      } else if (option.custom && option.custom.clickedProfile && sessionStorage.getItem("user") === null) {        
        let toast = this.toastCtrl.create({
          message: 'Error: Please Login to Manage Profile',
          cssClass: 'toast',
          duration: 3000
        });
        toast.present();      
        this.navCtrl.setRoot(LoginPage);
      } else {
        // Redirect to the selected page
        this.navCtrl.setRoot(option.component);
      }
    });
  }

  public collapseMenuOptions(): void {
    // Collapse all the options
    this.sideMenu.collapseAllOptions();
  }

  public presentAlert(message: string): void {
    let alert = this.alertCtrl.create({
      title: 'Information',
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  openPage(page) {
    if (page.title == "Exit"){
      this.platform.exitApp();
    }
    else {
      this.navCtrl.setRoot(page.component);
    }
  }
}
