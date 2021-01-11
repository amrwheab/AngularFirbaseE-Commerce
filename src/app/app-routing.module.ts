import { UserProfileComponent } from './user-profile/user-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home/:categ', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'cart', component: CartComponent},
  { path: 'home/accessories/:id', component: ProductComponent},
  { path: 'home/clothes/:id', component: ProductComponent},
  { path: 'home/devices/:id', component: ProductComponent},
  { path: 'home/food/:id', component: ProductComponent},
  { path: 'userprofile/:id', component: ProfileComponent},
  { path: 'user/:id', component: UserProfileComponent},
  { path: 'home', redirectTo: 'home/main', pathMatch: 'full'},
  { path: '',   redirectTo: 'home/main', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
