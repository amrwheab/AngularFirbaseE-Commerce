import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private firestore: AngularFirestore, private authser: AuthService) { }

  getDevices(): Observable<any[]> {
    return this.firestore.collection('devices').snapshotChanges();
  }
  // tslint:disable-next-line: typedef
  updateFeatures() {
    return this.firestore.collection('devices').doc(this.authser.userId);
}
}
