import { MinCartService } from './../../services/min-cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { CartService } from './../../services/cart.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccessService } from './../../services/access.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.css'],
  animations: [
    trigger('slide', [
      state('void', style({ opacity: 0, right: '-250px' })),
      state('*', style({ opacity: 1, right: '35px' })),
      transition('* <=> void', [
        animate('0.5s')
      ]),
    ]), trigger('fade', [
      state('void', style({opacity: 0})),
      transition('* <=> void', [
        animate('.3s')
      ])
    ])
  ]
})
export class AccessoriesComponent implements OnInit {

  accessories = [];
  carting = [];
  faTrashAlt = faTrashAlt;
  amount = [];
  accs = [];
  errNumber = false;
  categ = '';
  containWidth: string;
  cardWidth: string;
  alertChgPer;
  usedCart = [];
  ACid: string;
  ACNum: number;
  loginNavBol = true;
  @ViewChild('grayAll', {static: false}) grayAll: ElementRef;

  constructor(private accessS: AccessService,
              private cartser: CartService,
              private authser: AuthService,
              private route: Router,
              private routact: ActivatedRoute,
              private minCartSer: MinCartService) { }

  ngOnInit(): void {
    this.accessS.getAccess().subscribe(a => {
      this.accessories = a.map(ele => {
        return {
          id: ele.payload.doc.id,
          ...ele.payload.doc.data()
        };
      });

      this.accs = this.accessories.filter(b => !b.cartId);

      this.authser.user.subscribe(user => {
        if (user) {
          const userFound = this.accessories.find(c => c.cartId === this.authser.userId);
          if (userFound) {
            if (userFound.amount.length === this.accs.length ) {
              this.amount = userFound.amount;
              this.carting = userFound.carting;
            }else {
              this.amount = [];
              this.carting = [];
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.accs.length; i++) {
                this.amount.push(1);
                this.carting.push(true);
              }
              this.cartser.getCart(this.authser.userId).subscribe(usedCart => {
                this.usedCart = usedCart.map(ele => ele.payload.doc.data()).filter(v => v.type === 'accessories');
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < this.usedCart.length; j++) {
                  this.ACid = this.usedCart[j].id;
                  this.ACNum = this.accs.findIndex(val => val.id === this.ACid);

                  this.amount[this.ACNum] = this.usedCart[j].amount;
                  this.carting[this.ACNum] = false;

                }
                this.accessS.updateFeatures()
                .set({ cartId: this.authser.userId, type: 'accessories', amount: this.amount, carting: this.carting });
              });
            }
          } else {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.accs.length; i++) {
              this.amount.push(1);
              this.carting.push(true);
            }
            this.accessS.updateFeatures()
            .set({ cartId: this.authser.userId, type: 'accessories', amount: this.amount, carting: this.carting });
          }
        } else {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.accs.length; i++) {
            this.amount.push(1);
            this.carting.push(true);
          }
        }
      });
      this.routact.paramMap.subscribe(d => {
        this.categ = d.get('categ');
        if (this.categ !== 'accessories') {
          this.containWidth = (250 * this.accs.length) + 'px';
        } else {
          this.containWidth = 'auto';
        }
      });
    });

    window.addEventListener('click', (e) => {
      if (this.authser.loginConBol) {
        if (e.target === this.grayAll.nativeElement) {
          this.authser.loginConBol = false;
        }
      }
    });
  }

  errNumbering(): void {
    this.errNumber = true;
    setTimeout(() => this.errNumber = false, 2000);
  }

  alertChange(): void {
    window.clearTimeout(this.alertChgPer);
    this.minCartSer.alertChg = true;
    setTimeout(() => {
      this.alertChgPer = setTimeout(() => this.minCartSer.alertChg = false, 1000);
    }, 0);
  }

  setCart(i, bol, acc): void {
    if (this.authser.userId) {
      if (bol === true) {
        this.cartser.totalPrice = [];
        this.amount[i] += 1;
      } else if (bol === false) {
        if (this.amount[i] > 1) {
          this.cartser.totalPrice = [];
          this.amount[i] -= 1;
          this.alertChange();
        } else {
          this.errNumbering();
        }
      } else {
        this.amount[i] = this.amount[i];
        this.carting[i] = !this.carting[i];
      }
      this.cartser.setCart(acc.id, {
        id: acc.id,
        name: acc.name,
        prodImg: acc.src,
        price: acc.price,
        type: 'accessories',
        amount: this.amount[i]
      });
      this.accessS.updateFeatures().set({ cartId: this.authser.userId, type: 'accessories', amount: this.amount, carting: this.carting });
    } else {
      this.authser.loginConBol = true;
    }
  }

  loginConBol(): boolean {
    return this.authser.loginConBol;
  }

  deleteCart(id, i): void {
    this.alertChange();
    this.cartser.totalPrice = [];
    this.carting[i] = true;
    this.amount[i] = 1;
    this.cartser.deleteCart(id);
    this.accessS.updateFeatures().set({});
  }

  navToProd(id): void {
    this.route.navigate([`/home/accessories/${id}`]);
    window.scrollTo(0, 0);
  }

}
