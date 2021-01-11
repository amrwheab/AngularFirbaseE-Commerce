import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private firestore: AngularFirestore) { }

  getComments(): Observable<any> {
    return this.firestore.collection('comments').snapshotChanges();
  }
}
