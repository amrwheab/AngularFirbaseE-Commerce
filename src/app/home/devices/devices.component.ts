import { MinCartService } from './../../services/min-cart.service';
import { AuthService } from './../../services/auth.service';
import { CartService } from './../../services/cart.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DevicesService } from './../../services/devices.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
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
export class DevicesComponent implements OnInit {

  devices = [];
  carting = [];
  faTrashAlt = faTrashAlt;
  amount = [];
  devs = [];
  alertAdd = false;
  alertUpdate = false;
  errNumber = false;
  alertDeleting = false;
  categ: string;
  containWidth: string;
  cardWidth: string;
  alertChgPer;
  usedCart = [];
  ACid: string;
  ACNum: number;
  loginNavBol = true;
  @ViewChild('grayAll', {static: false}) grayAll: ElementRef;

  constructor(private devicser: DevicesService,
              private cartser: CartService,
              private authser: AuthService,
              private route: Router,
              private routact: ActivatedRoute,
              private minCartSer: MinCartService) { }

  ngOnInit(): void {
    this.devicser.getDevices().subscribe(a => {
      this.devices = a.map(ele => {
        return {
          id: ele.payload.doc.id,
          ...ele.payload.doc.data()
        };
      });

      this.devs = this.devices.filter( b => !b.cartId);

      this.authser.user.subscribe(user => {
        if (user) {
          const userFound = this.devices.find( c => c.cartId === this.authser.userId);
          if (userFound){
            if (userFound.amount.length === this.devs.length) {
              this.amount = userFound.amount;
              this.carting = userFound.carting;
            }else {
              this.amount = [];
              this.carting = [];
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.devs.length; i++) {
                this.amount.push(1);
                this.carting.push(true);
              }
              this.cartser.getCart(this.authser.userId).subscribe(usedCart => {
                this.usedCart = usedCart.map(ele => ele.payload.doc.data()).filter(v => v.type === 'devices');
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < this.usedCart.length; j++) {
                  this.ACid = this.usedCart[j].id;
                  this.ACNum = this.devs.findIndex(val => val.id === this.ACid);

                  this.amount[this.ACNum] = this.usedCart[j].amount;
                  this.carting[this.ACNum] = false;

                }
                // tslint:disable-next-line: max-line-length
                this.devicser.updateFeatures().set({ cartId: this.authser.userId, type: 'devices', amount: this.amount, carting: this.carting });
              });
            }
          } else {
            // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.devs.length; i++) {
            this.amount.push(1);
            this.carting.push(true);
          }
          this.devicser.updateFeatures().set({ cartId: this.authser.userId, type: 'devices', amount: this.amount, carting: this.carting });
          }
        }else {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.devs.length; i++) {
            this.amount.push(1);
            this.carting.push(true);
          }
        }
      });
      this.routact.paramMap.subscribe(d => {
        this.categ = d.get('categ');
        if (this.categ !== 'devices') {
          this.containWidth = (250 * this.devs.length) + 'px';
          this.cardWidth = '245px';
        }else {
          this.containWidth = 'auto';
          this.cardWidth = '24.5%';
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
        this.amount[i] += 1;
      } else if (bol === false) {
        if (this.amount[i] > 1) {
          this.amount[i] -= 1;
          this.alertChange();
        } else {
          this.errNumbering();
        }
      } else {
        this.amount[i] = this.amount[i];
        this.carting[i] = !this.carting[i];
      }
      this.cartser.setCart(acc.id, { id: acc.id,
        name: acc.name,
        price: acc.price,
        prodImg: acc.src,
        type: 'devices',
        amount: this.amount[i] });
      this.devicser.updateFeatures().set({cartId: this.authser.userId, type: 'devices', amount: this.amount, carting: this.carting});
    }else {
      this.authser.loginConBol = true;
    }
  }

  loginConBol(): boolean {
    return this.authser.loginConBol;
  }

  deleteCart(id, i): void {
    this.alertChange();
    this.carting[i] = !this.carting[i];
    this.amount[i] = 1;
    this.cartser.deleteCart(id);
    this.devicser.updateFeatures().set({});
}

navToProd(id): void {
  this.route.navigate([`/home/devices/${id}`]);
  window.scrollTo(0, 0);
}
}
