import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private firebasestore: AngularFirestore, private authser: AuthService) { }

  getAccess(): Observable<any[]> {
    return this.firebasestore.collection('accessories').snapshotChanges();
  }

  // tslint:disable-next-line: typedef
  updateFeatures() {
    return this.firebasestore.collection('accessories').doc(this.authser.userId);
}
}
