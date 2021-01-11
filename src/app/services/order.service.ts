import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore) { }

  setOrder(data): Promise<any> {
    return this.firestore.collection('orders').add(data);
  }

  getOrder(): Observable<any> {
    return this.firestore.collection('orders').snapshotChanges();
  }

  deleteOrder(id): Promise<any> {
    return this.firestore.collection('orders').doc(id).delete();
  }

}
