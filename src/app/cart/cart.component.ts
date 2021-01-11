import { OrderService } from './../services/order.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartService } from './../services/cart.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('* <=> void', [
        animate('.2s')
      ]),
    ])
  ]
})
export class CartComponent implements OnInit {

  faTrashAlt = faTrashAlt;
  cartConrent: any[];
  totalPrice: number;
  validPage = true;
  validCart = true;
  values = [];
  updateCheckNum = [];
  router: boolean;
  orderBol = false;

  constructor(private cartser: CartService,
              private authser: AuthService,
              private firestore: AngularFirestore,
              private route: Router,
              private order: OrderService) { }


  ngOnInit(): void {
    this.authser.user.subscribe(user => {
      if (user) {
        this.cartser.getCart(user.uid).subscribe(cart => {
        this.cartConrent = cart.map(ele => {
          return {
            id: ele.payload.doc.id,
            ...ele.payload.doc.data()
          };
        });
        if (this.cartConrent.length >= 1) {
          this.validCart = true;
        }else {
          this.validCart = false;
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.cartConrent.length; i++ ){
          this.values[i] = this.cartConrent[i].amount;
          this.cartser.totalPrice[i] = this.cartConrent[i].amount * this.cartConrent[i].price;
          this.updateCheckNum[i] = this.cartConrent[i].amount;
        }
        // tslint:disable-next-line: no-eval
        this.totalPrice = eval(this.cartser.totalPrice.join('+'));
      });
      }else {
        this.validPage = false;
      }
    });

    if (this.route.url === '/cart') {
      this.router = true;
    }else {
      this.router = false;
    }

  }

deleteCart(id, typee): void {
  this.cartser.totalPrice = [];
  this.cartser.deleteCart(id);
  this.firestore.collection(typee).doc(this.authser.userId).set({});
  }

updateCart(id, value, typee, i): void {
  if (this.updateCheckNum[i] !== value) {
    this.cartser.totalPrice = [];
    this.cartser.updateCart(id, {amount: value});
    this.firestore.collection(typee).doc(this.authser.userId).set({});
    this.updateCheckNum[i] = value;
  }
}

setOrder(): void {
  const data = {
    userId: this.authser.userId,
    time: new Date().getTime(),
    salary: this.totalPrice,
    cart: this.cartConrent,
    pending: true
  };
  this.order.setOrder(data);
  const types = ['accessories', 'clothes', 'food', 'devices'];
  for (const type of types) {
    this.firestore.collection(type).doc(this.authser.userId).set({});
  }
  for (const cart of this.cartConrent) {
    this.firestore.collection(this.authser.userId).doc(cart.id).delete();
  }

  this.route.navigate(['/home']);
}

cancelOrderBol(elem: Element, e: Event): void {
  if (e.target !== elem.children[0] && e.target !== elem.children[0].children[0]
    && e.target !== elem.children[0].children[0].children[0]
    && e.target !== elem.children[0].children[0].children[1]
    && e.target !== elem.children[0].children[0].children[2]
    && e.target !== elem.children[0].children[0].children[0].children[0]
    ) {
      this.orderBol = false;
  }
}
}
