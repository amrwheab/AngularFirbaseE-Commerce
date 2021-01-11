import { OrderService } from './../services/order.service';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  animations: [
    trigger('pop', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('* <=> void', [
        animate('0.3s')
      ]),
    ])
  ]
})
export class UserProfileComponent implements OnInit {

  faPlus = faPlus;
  faTimes = faTimes;
  popUp = false;
  userId = '';
  userData = {userId: '', imgUrl: '', name: '', email: '', gender: '', id: '', telNum: '', address: '', buyTimes: 0};
  @ViewChild('popImg', {static: false}) popImg: ElementRef;
  orders = [];

  constructor(private userser: UserService,
              private orderser: OrderService,
              private route: Router) { }

  ngOnInit(): void {
    this.userId = this.route.url.slice(6);
    this.userser.getUser().subscribe(data => {
      this.userData = data.map(ele => {
        return {
          userId: ele.payload.doc.id,
          ...ele.payload.doc.data()
        };
      }).find(a => a.id === this.userId);
      if (!this.userData) {
        this.route.navigate(['/notfound']);
      }
    });

    this.orderser.getOrder().subscribe(orders => {
      this.orders = orders.map(ele => {
        return {
          id: ele.payload.doc.id,
          ...ele.payload.doc.data()
        };
      }).filter(us => us.userId === this.userId);
    });
  }

  popClick(e): void {
    if (e.target !== this.popImg.nativeElement){
      this.popUp = !this.popUp;
    }
  }
}
