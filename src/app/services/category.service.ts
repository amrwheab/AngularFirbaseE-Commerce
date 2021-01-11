import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firebaseget: AngularFirestore) { }

  getCategory(): Observable<unknown[]> {
    return this.firebaseget.collection('categories').valueChanges();
  }
}
