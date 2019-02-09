import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { ViewTransactionsPage } from '../pages/viewTransactions/viewTransactions';
import { ShopsPage } from '../pages/shops/shops';
import { ShopIndivPage } from '../pages/shop-indiv/shop-indiv';
import { ProductIndivPage } from '../pages/product-indiv/product-indiv';
import { ShoppingCartPage } from '../pages/shoppingCart/shoppingCart';
import { DeliveryPage } from '../pages/delivery/delivery';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ConfirmTransactionPage } from '../pages/confirm-transaction/confirm-transaction'
import { ReviewPage } from '../pages/review/review';
import { CatConfectionaryPage } from '../pages/category-confectionery/category-confectionery';
import { CatFlowersPage } from '../pages/category-flowers/category-flowers';
import { CatPlushiesPage } from '../pages/category-plushies/category-plushies';
import { ViewReviewsPage } from '../pages/view-reviews/view-reviews';
import { TransactionIndivPage } from '../pages/transaction-indiv/transaction-indiv';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ProductProvider } from '../providers/product/product';
import { UserProvider } from '../providers/user/user';
import { Api } from '../providers/api/api';
import { PromotionProvider } from '../providers/promotion/promotion';
import { ReviewProvider } from '../providers/review/review';
import { TransactionProvider } from '../providers/transaction/transaction';

// Custom components
import { SideMenuContentComponent } from '../pages/side-menu-content/side-menu-content.component';
import { ShopProvider } from '../providers/shop/shop';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ProfilePage,
    ViewTransactionsPage,
    ShopsPage,
    ShopIndivPage,
    ProductIndivPage,
    ShoppingCartPage,
    DeliveryPage,
    ChangePasswordPage,
    ConfirmTransactionPage,
    ReviewPage,
    CatConfectionaryPage,
    CatFlowersPage,
    CatPlushiesPage,
    ViewReviewsPage,
    TransactionIndivPage,
    ForgotPasswordPage,
    SideMenuContentComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ProfilePage,
    ViewTransactionsPage,
    ShopsPage,
    ShopIndivPage,
    ProductIndivPage,
    ShoppingCartPage,
    DeliveryPage,    
    ChangePasswordPage,
    ConfirmTransactionPage,
    ReviewPage,
    CatConfectionaryPage,
    CatFlowersPage,
    CatPlushiesPage,
    TransactionIndivPage,
    ForgotPasswordPage,
    ViewReviewsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //{provide: ErrorHandler, useClass: IonicErrorHandler},
    ProductProvider,
    UserProvider,
    Api,
    PromotionProvider,
    ReviewProvider,
    TransactionProvider,
    ShopProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {}
