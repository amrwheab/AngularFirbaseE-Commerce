import { MinCartService } from './../services/min-cart.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { UserService } from './../services/user.service';
import { CartService } from './../services/cart.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart,
  faSignOutAlt,
  faHome,
  faSignInAlt,
  faUserPlus,
  faBars,
  faCog,
  faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('* <=> void', [
        animate('.2s')
      ]),
    ])
  ]
})
export class NavComponent implements OnInit {

  @ViewChild('imgOpen') imgOpen: ElementRef;
  @ViewChild('imgRef') imgRef: ElementRef;
  @ViewChild('mobIcon') mobIcon: any;

  user: boolean;
  faShoppingCart = faShoppingCart;
  faHome = faHome;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faBars = faBars;
  faCog = faCog;
  faUser = faUser;
  cartlength = 0;
  cartlengthshow = false;
  userId = '';
  userImg = '';
  toggleImg = false;
  hoverToggle = false;
  mobileScreen: boolean;
  mobnav: number;

  constructor(private as: AuthService,
              private route: Router,
              private cartser: CartService,
              private userser: UserService,
              private minCartSer: MinCartService) { }

  ngOnInit(): void {
    this.as.user.subscribe(user => {
      if (user) {
        this.as.userId = user.uid;
        this.userId = user.uid;

        this.user = true;
        this.cartser.getCart(user.uid).subscribe(a => {
          if (a.length >= 1){
            this.cartlength = a.length;
            this.cartlengthshow = true;
          }else {
            this.cartlengthshow = false;
          }
        });

        this.userser.getUserNav().subscribe( y => {
          this.userImg = y.find(u => u.id === user.uid).imgUrl;
          if (this.userImg) {
            this.as.userImg = this.userImg;
          }else {
            this.as.userImg = '';
          }
        });

      }else {
        this.user = false;
        this.cartlength = 0;
      }
    });

    window.addEventListener('click', (e) => {
      this.imgOpenToggle(e);
    });

    if (window.innerWidth >= 576 && window.innerWidth < 768) {
    }else if (window.innerWidth >= 768 && window.innerWidth < 992) {
    }else if (window.innerWidth >= 992 && window.innerWidth < 1200) {
    }else {
    }

    if (window.innerWidth <= 576) {
      this.mobileScreen = true;
    }

    window.addEventListener('resize', () => {
      this.mobnav = window.innerWidth;
      if (window.innerWidth <= 576) {
        this.mobileScreen = true;
      }else {
        this.mobileScreen = false;
      }
    });

    this.mobnav = window.innerWidth;
  }

  logOut(): void {
    this.as.logout().then(() => {
      this.as.userId = '';
      this.route.navigate(['/home/main']);
    }).then(() => window.location.reload());
  }

  imgOpenToggle(e): void {
    if (this.user && !this.mobileScreen) {
      if (this.toggleImg === true) {
        if (e.target !== this.imgOpen.nativeElement) {
          this.toggleImg = false;
        }
      }else {
        if (e.target === this.imgRef.nativeElement) {
          this.toggleImg = true;
        }
      }
    }
  }

  iconCli(e): any {
    return e.target;
  }

  alertChg(): boolean {
    return this.minCartSer.alertChg;
  }

  mouseOnCart(): void {
    if (this.route.url !== '/cart') {
      this.hoverToggle = true;
    }
  }

}
