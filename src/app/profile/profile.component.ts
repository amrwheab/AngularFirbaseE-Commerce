import { OrderService } from './../services/order.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlus, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
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
export class ProfileComponent implements OnInit {

  faPlus = faPlus;
  faTimes = faTimes;
  faCog = faCog;
  popUp = false;
  updateTelNum = '';
  updateTelNumBol = false;
  updateAdress = '';
  updateAdressBol = false;
  userData = {userId: '', imgUrl: '', name: '', email: '', gender: '', id: '', telNum: '', address: '', buyTimes: 0};
  orders = [];
  orderBol = false;
  orderRemovingId: string;
  @ViewChild('popImg', {static: false}) popImg: ElementRef;

  constructor(private userser: UserService,
              private authser: AuthService,
              private storage: AngularFireStorage,
              private orderser: OrderService) { }

  ngOnInit(): void {
    this.authser.user.subscribe(user => {
        this.userser.getUser().subscribe(data => {
          this.userData = data.map(ele => {
            return {
              userId: ele.payload.doc.id,
              ...ele.payload.doc.data()
            };
          })
          .find(a => a.id === user.uid);

          this.updateTelNum = this.userData.telNum;
          this.updateAdress = this.userData.address;
        });

        this.orderser.getOrder().subscribe(orders => {
          this.orders = orders.map(ele => {
            return {
              id: ele.payload.doc.id,
              ...ele.payload.doc.data()
            };
          }).filter(us => us.userId === user.uid);
        });
    });
  }

  uploadImg(e): void {
    const filepath = `${e.srcElement.files[0].name.slice(0, e.srcElement.files[0].name.indexOf('.'))}_${new Date().getTime()}.${e.srcElement.files[0].name.slice(-e.srcElement.files[0].name.indexOf('.'))}`;
    const fileRef = this.storage.ref(filepath);
    this.storage.upload(filepath, e.srcElement.files[0]).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => this.userser.addUserElem(this.userData.userId, {imgUrl: url}));
      })
    ).subscribe();
  }

  popClick(e): void {
    if (e.target !== this.popImg.nativeElement){
      this.popUp = !this.popUp;
    }
  }

  changePro(e): void {
    if (e === 0) {
      this.userser.addUserElem(this.userData.userId, {telNum: this.updateTelNum});
      this.updateTelNumBol = false;
    }else {
      this.userser.addUserElem(this.userData.userId, {address: this.updateAdress});
      this.updateAdressBol = false;
    }
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

  cancelOrder(): void {
    this.orderser.deleteOrder(this.orderRemovingId);
  }

}
