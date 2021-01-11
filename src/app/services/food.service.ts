import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private firestore: AngularFirestore, private authser: AuthService) { }

  getFood(): Observable<any[]> {
    return this.firestore.collection('food').snapshotChanges();
  }
  // tslint:disable-next-line: typedef
  updateFeatures() {
    return this.firestore.collection('food').doc(this.authser.userId);
}
}
