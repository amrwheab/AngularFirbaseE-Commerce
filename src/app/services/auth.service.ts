import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user;
  userId;
  userImg;
  loginConBol = false;

  constructor(private fireauth: AngularFireAuth) {
    this.user = fireauth.user;
  }

  signUp(email, password): Promise<firebase.auth.UserCredential> {
    return this.fireauth
    .createUserWithEmailAndPassword(email, password);
  }

  login(email, password): Promise<firebase.auth.UserCredential> {
    return this.fireauth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.fireauth.signOut();
  }

}
