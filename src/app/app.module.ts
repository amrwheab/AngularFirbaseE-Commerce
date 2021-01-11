import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CartComponent } from './cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClothesComponent } from './home/clothes/clothes.component';
import { AccessoriesComponent } from './home/accessories/accessories.component';
import { DevicesComponent } from './home/devices/devices.component';
import { FoodComponent } from './home/food/food.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductComponent } from './product/product.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    SignupComponent,
    NavComponent,
    ClothesComponent,
    AccessoriesComponent,
    DevicesComponent,
    FoodComponent,
    ProfileComponent,
    ProductComponent,
    PageNotFoundComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDaebBnkPUmjt4VZnWHkQL1ZTR2W2D3t6k',
      authDomain: 'fire2-923ad.firebaseapp.com',
      databaseURL: 'https://fire2-923ad.firebaseio.com',
      projectId: 'fire2-923ad',
      storageBucket: 'fire2-923ad.appspot.com',
      messagingSenderId: '385252958485',
      appId: '1:385252958485:web:ac6afa5ca5c0453924091c',
      measurementId: 'G-TZXNT9K860'
    }),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
