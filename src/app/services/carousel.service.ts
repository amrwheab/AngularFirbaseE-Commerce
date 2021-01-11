import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private firestore: AngularFirestore) { }

  getCarousel(): Observable<any> {
    return this.firestore.collection('carousel').valueChanges();
  }
}
