import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClothService {

  constructor(private firestore: AngularFirestore, private authser: AuthService) { }

  getClothes(): Observable<any[]> {
    return this.firestore.collection('clothes').snapshotChanges();
  }
  // tslint:disable-next-line: typedef
  updateFeatures() {
    return this.firestore.collection('clothes').doc(this.authser.userId);
}
}
