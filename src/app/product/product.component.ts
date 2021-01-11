import { CommentsService } from './../services/comments.service';
import { AuthService } from './../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  categ: string;
  categId: string;
  product = {id: '', data: {}};
  removeFromCart: boolean;
  remFC: any;
  prodId: any;
  amountNum = 1;
  comments = [];
  commInput = '';
  commentError = false;
  imgUrl: any;
  userImages = [];
  userName = [];
  faStar = faStar;
  starN1: string[];
  starN2: string[];
  starN3: string[];
  starN4: string[];
  starN5: string[];
  starColor = ['black', 'black', 'black', 'black', 'black'];
  starCheck: boolean;
  loginNavBol = true;
  @ViewChild('grayAll', {static: false}) grayAll: ElementRef;


  constructor(private router: Router,
              private firestore: AngularFirestore,
              private authser: AuthService,
              private commentser: CommentsService) { }

  ngOnInit(): void {
    const urlHelp = this.router.url.slice(6);
    this.categ = urlHelp.slice(0, urlHelp.indexOf('/'));
    this.categId = urlHelp.slice(urlHelp.indexOf('/') + 1);

    this.authser.user.subscribe(user => {
      this.firestore.collection(this.categ).snapshotChanges().subscribe(a => {
        this.product = a.map(ele => {
          return {
            id: ele.payload.doc.id,
            data: ele.payload.doc.data()
          };
        }).find(prod => prod.id === this.categId);
        if (!this.product) {
          this.router.navigate(['/notfound']);
        }

        // tslint:disable-next-line: no-string-literal
        this.starN1 = this.product.data['star1'];
        // tslint:disable-next-line: no-string-literal
        this.starN2 = this.product.data['star2'];
        // tslint:disable-next-line: no-string-literal
        this.starN3 = this.product.data['star3'];
        // tslint:disable-next-line: no-string-literal
        this.starN4 = this.product.data['star4'];
        // tslint:disable-next-line: no-string-literal
        this.starN5 = this.product.data['star5'];

        if (this.starN1.includes(this.authser.userId) ||
        this.starN2.includes(this.authser.userId) ||
        this.starN3.includes(this.authser.userId) ||
        this.starN4.includes(this.authser.userId) ||
        this.starN5.includes(this.authser.userId)
        ) {
          this.starCheck = true;
        }else {
          this.starCheck = false;
        }

        if (this.starN1.includes(this.authser.userId)) {
          this.starColor[0] = 'rgb(255, 243, 73)';
        }else if (this.starN2.includes(this.authser.userId)) {
          this.starColor[0] = 'rgb(255, 243, 73)';
          this.starColor[1] = 'rgb(255, 243, 73)';
        }else if (this.starN3.includes(this.authser.userId)) {
          this.starColor[0] = 'rgb(255, 243, 73)';
          this.starColor[1] = 'rgb(255, 243, 73)';
          this.starColor[2] = 'rgb(255, 243, 73)';
        }else if (this.starN4.includes(this.authser.userId)) {
          this.starColor[0] = 'rgb(255, 243, 73)';
          this.starColor[1] = 'rgb(255, 243, 73)';
          this.starColor[2] = 'rgb(255, 243, 73)';
          this.starColor[3] = 'rgb(255, 243, 73)';
        }else if (this.starN5.includes(this.authser.userId)) {
          this.starColor[0] = 'rgb(255, 243, 73)';
          this.starColor[1] = 'rgb(255, 243, 73)';
          this.starColor[2] = 'rgb(255, 243, 73)';
          this.starColor[3] = 'rgb(255, 243, 73)';
          this.starColor[4] = 'rgb(255, 243, 73)';
        }
      });

      if (user) {
        this.firestore.collection(user.uid).valueChanges().subscribe(b => {
          this.prodId = b;
          this.prodId = this.prodId.find(c => c.id === this.categId);

          if (this.prodId) {
            this.removeFromCart = true;
            this.amountNum = this.prodId.amount;
          }
        });

        this.firestore.collection(this.authser.userId).snapshotChanges().subscribe(elem => {
          this.remFC = elem.map(ele => ele.payload.doc.id).find(e => e === this.categId);

          if (this.remFC) {
            this.removeFromCart = true;
          }else {
            this.removeFromCart = false;
          }
        });
      }
    });
    this.commentser.getComments().subscribe(comment => {
      this.comments = comment.map(ele => {
        return  {
          commId: ele.payload.doc.id,
          ...ele.payload.doc.data()
        };
      }).filter((prod: any) => prod.prodId === this.categId);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.comments.length; i++) {
        this.firestore.collection('user').valueChanges().subscribe((us: any) => {
          this.userImages[i] = us.find((uss: any) => uss.id === this.comments[i].userId).imgUrl;
          this.userName[i] = us.find((uss: any) => uss.id === this.comments[i].userId).name;
        });
      }
    });

    window.addEventListener('click', (e) => {
      if (this.authser.loginConBol) {
        if (e.target === this.grayAll.nativeElement) {
          this.authser.loginConBol = false;
        }
      }
    });
  }

  addToCartMeth(): void {
    if (this.authser.userId) {
      this.removeFromCart = true;
      this.firestore.collection(this.authser.userId).doc(this.categId).set({
        amount: 1,
        id: this.product.id,
        // tslint:disable-next-line: no-string-literal
        name: this.product.data['name'],
        // tslint:disable-next-line: no-string-literal
        price: this.product.data['price'],
        // tslint:disable-next-line: no-string-literal
        prodImg: this.product.data['src'],
        type: this.categ
      });
      this.firestore.collection(this.categ).doc(this.authser.userId).set({});
    }else {
      this.authser.loginConBol = true;
    }
  }

  removeFromCartMeth(): void {
    this.removeFromCart = false;
    this.firestore.collection(this.authser.userId).doc(this.categId).delete();
    this.firestore.collection(this.categ).doc(this.authser.userId).set({});
  }

  updateCartMeth(): void {
    this.firestore.collection(this.authser.userId).doc(this.categId).update({amount: this.amountNum});
    this.firestore.collection(this.categ).doc(this.authser.userId).set({});
  }

  addComment(): void {
    if (this.authser.userId) {
      if (this.commInput === '') {
        this.commentError = true;
        setTimeout(() => this.commentError = false, 1000);
      }else {
          this.firestore.collection('comments').add({
            userId: this.authser.userId,
            prodId: this.categId,
            comment: this.commInput
          });
      }
      this.commInput = '';
    }else {
      this.authser.loginConBol = true;
    }
  }

  routeToUser(id): string {
    if (id === this.authser.userId) {
      return `/userprofile/${id}`;
    }else {
      return `/user/${id}`;
    }
  }

  rate(num: number): void {
    if (this.authser.userId) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.starN1.length; i++) {
        if (this.starN1[i] === this.authser.userId) {
          this.starN1.splice(i, 1);
          this.firestore.collection(this.categ).doc(this.categId).update({star1: this.starN1});
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.starN2.length; i++) {
        if (this.starN2[i] === this.authser.userId) {
          this.starN2.splice(i, 1);
          this.firestore.collection(this.categ).doc(this.categId).update({star2: this.starN2});
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.starN3.length; i++) {
        if (this.starN3[i] === this.authser.userId) {
          this.starN3.splice(i, 1);
          this.firestore.collection(this.categ).doc(this.categId).update({star3: this.starN3});
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.starN4.length; i++) {
        if (this.starN4[i] === this.authser.userId) {
          this.starN4.splice(i, 1);
          this.firestore.collection(this.categ).doc(this.categId).update({star4: this.starN4});
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.starN5.length; i++) {
        if (this.starN5[i] === this.authser.userId) {
          this.starN5.splice(i, 1);
          this.firestore.collection(this.categ).doc(this.categId).update({star5: this.starN5});
        }
      }

      if (num === 1) {
        this.starN1.push(this.authser.userId);
        this.starColor = ['rgb(255, 243, 73)', 'black', 'black', 'black', 'black'];
        this.firestore.collection(this.categ).doc(this.categId).update({star1: this.starN1});
      }else if (num === 2) {
        this.starN2.push(this.authser.userId);
        this.starColor = ['rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'black', 'black', 'black'];
        this.firestore.collection(this.categ).doc(this.categId).update({star2: this.starN2});
      }else if (num === 3) {
        this.starN3.push(this.authser.userId);
        this.starColor = ['rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'black', 'black'];
        this.firestore.collection(this.categ).doc(this.categId).update({star3: this.starN3});
      }else if (num === 4) {
        this.starN4.push(this.authser.userId);
        this.starColor = ['rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'black'];
        this.firestore.collection(this.categ).doc(this.categId).update({star4: this.starN4});
      }else if (num === 5) {
        this.starN5.push(this.authser.userId);
        this.starColor = ['rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)', 'rgb(255, 243, 73)'];
        this.firestore.collection(this.categ).doc(this.categId).update({star5: this.starN5});
      }else {
        this.starColor = ['black', 'black', 'black', 'black', 'black'];
      }
    } else {
      this.authser.loginConBol = true;
    }
  }

  loginConBol(): boolean {
    return this.authser.loginConBol;
  }

}
