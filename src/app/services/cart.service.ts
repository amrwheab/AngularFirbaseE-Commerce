import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  totalPrice = [];

  constructor(private authser: AuthService, private firestore: AngularFirestore) {}

  getCart(data): Observable<any[]>{
    return this.firestore.collection(data).snapshotChanges();
  }

  setCart(id, data): Promise<void> {
    return this.firestore.collection(this.authser.userId).doc(id).set(data);
  }

  updateCart(id, data): Promise<void> {
    return this.firestore.collection(this.authser.userId).doc(id).update(data);
  }

  deleteCart(id): Promise<void> {
    return this.firestore.collection(this.authser.userId).doc(id).delete();
  }
}
