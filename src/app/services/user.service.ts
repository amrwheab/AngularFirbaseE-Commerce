import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  addUser(data): Promise<any> {
    return this.firestore.collection('user').add(data);
  }

  getUser(): Observable<any[]> {
    return this.firestore.collection('user').snapshotChanges();
  }

  getUserNav(): Observable<any[]> {
    return this.firestore.collection('user').valueChanges();
  }

  addUserElem(id, data): Promise<void> {
    return this.firestore.collection('user').doc(id).update(data);
  }
}
