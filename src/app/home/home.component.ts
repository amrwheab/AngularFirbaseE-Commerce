import { CarouselService } from './../services/carousel.service';
import { CategoryService } from './../services/category.service';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faExchangeAlt, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('* <=> void', [
        animate('.5s')
      ]),
    ])
  ]
})
export class HomeComponent implements OnInit {

  categories = [];
  carouselContent = [];

  slideShow = '0';
  homePaddingLeft = '270px';
  homePaddingRight = '20px';
  faExchangeAlt = faExchangeAlt;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  categ: string;
  user: boolean;
  carPosition: number;
  carTran = '.5s ease-out;';
  pageSize: number;
  comCarVal = [0, 0, 0, 0];
  comCarRActive = [true, true, true, true];
  comCarLActive = [false, false, false, false];
  lastOfCom: number;
  sliderIterv;
  mobileScreen: boolean;
  slideMove = 500;
  touchStart: number;
  dureTouch: number;

  constructor(private routes: ActivatedRoute,
              private as: AuthService,
              private catser: CategoryService,
              private carser: CarouselService) { }

  ngOnInit(): void {
    this.routes.paramMap.subscribe(a => this.categ = a.get('categ'));
    this.as.user.subscribe(user => {
      if (user) {
        this.user = true;
      } else {
        this.user = false;
      }
    });
    this.carser.getCarousel().subscribe(car => this.carouselContent = car);

    this.catser.getCategory().subscribe(cat => this.categories = cat);


    if (window.innerWidth >= 576 && window.innerWidth < 768) {
      this.slideShow = '-250px';
      this.homePaddingLeft = '0';
      this.homePaddingRight = '0';
      this.mobileScreen = true;
      this.slideMove = 250;
    }else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.slideShow = '-250px';
      this.homePaddingLeft = '0';
      this.homePaddingRight = '0';
    }else if (window.innerWidth >= 992 && window.innerWidth < 1200) {
      // this.pageSize = 960;
      // this.carPosition = -960;
    }else {
      // this.pageSize = 1140;
      // this.carPosition = -1140;
    }

    if (window.innerWidth <= 576) {
      this.slideShow = '-250px';
      this.homePaddingLeft = '0';
      this.homePaddingRight = '0';
      this.mobileScreen = true;
      this.slideMove = 250;
    }

    this.pageSize = window.innerWidth;
    this.carPosition = - this.pageSize;

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);

    this.lastOfCom = (window.innerWidth - 340) / 1000 ;
  }

  slideTogle(): void {
    if (this.slideShow === '0') {
      this.slideShow = '-250px';
      this.homePaddingLeft = '0';
      this.homePaddingRight = '0';
    } else {
      this.slideShow = '0';
      this.homePaddingLeft = '270px';
      this.homePaddingRight = '20px';
    }
  }

  getTour(i): void {
    if (i === 0) {
      window.scrollTo(0, 530);
    }
  }

  carRight(w): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Bullets
    const i = this.carouselContent.indexOf(this.carouselContent.find(a => a.class));
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.carouselContent.length; j++) {
      this.carouselContent[j].class = '';
    }
    if (i === this.carouselContent.length - 1) {
      this.carouselContent[0].class = 'active';
    }else {
      this.carouselContent[i + 1].class = 'active';
    }

    // About Position
    if (this.carPosition === -w) {
      this.carPosition = 2 * (-w);
    } else {
      if (this.carPosition === -(this.carouselContent.length + 1) * w) {
        this.carPosition = -w;
        this.carTran = 'none';
        setTimeout(() => {
          this.carPosition -= w;
          this.carTran = '.5s ease-out;';
        }, 0);
      } else {
        this.carPosition -= w;
        this.carTran = '.5s ease-out;';
      }
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }

  carLeft(w): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Bullets
    const i = this.carouselContent.indexOf(this.carouselContent.find(a => a.class));
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.carouselContent.length; j++) {
      this.carouselContent[j].class = '';
    }
    if (i === 0) {
      this.carouselContent[this.carouselContent.length - 1].class = 'active';
    }else {
      this.carouselContent[i - 1].class = 'active';
    }

    // About Position
    if (this.carPosition === 0) {
      this.carTran = 'none';
      this.carPosition = -(this.carouselContent.length) * w;
      setTimeout(() => {
        this.carPosition += w;
        this.carTran = '.5s ease-out;';
      }, 0);
    }else if (this.carPosition === -w) {
      this.carPosition = 0;
    }else {
      this.carPosition += w;
    }

    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }

  bulletClick(i): void {
    // About Interval
    window.clearInterval(this.sliderIterv);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.carouselContent.length; j++) {
      this.carouselContent[j].class = '';
    }
    this.carouselContent[i].class = 'active';
    this.carPosition = -this.pageSize * (i + 1);
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize), 10000);
  }

  comCarL(i): void {
    if (this.comCarVal[i] + this.slideMove >= 0) {
      this.comCarLActive[i] = false;
      this.comCarVal[i] = 0;
    }else {
      this.comCarVal[i] += this.slideMove;
      this.comCarLActive[i] = true;
      this.comCarRActive[i] = true;
    }
  }

  comCarR(i, com): void {
    if (this.comCarVal[i] - this.slideMove <= -parseFloat(com) + this.lastOfCom * 1000 ) {
      this.comCarVal[i] = -parseFloat(com) + this.lastOfCom * 1000;
      this.comCarRActive[i] = false;
    }else {
      this.comCarVal[i] -= this.slideMove;
      this.comCarRActive[i] = true;
      this.comCarLActive[i] = true;
    }
  }

  swipeAcc(e, i, com): void {
    this.comCarVal[i] += e.deltaX;
    if (this.comCarVal[i] >= 0 && e.deltaX >= 0) {
      this.comCarVal[i] = 0;
      this.comCarLActive[i] = false;
    }else if (this.comCarVal[i] <= -parseFloat(com) + 250) {
      this.comCarVal[i] = -parseFloat(com) + 250;
      this.comCarRActive[i] = false;
    }else {
      this.comCarVal[i] += e.deltaX;
      this.comCarRActive[i] = true;
      this.comCarLActive[i] = true;
    }
  }

}
