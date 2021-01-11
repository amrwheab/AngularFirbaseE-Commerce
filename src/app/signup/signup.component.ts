import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = {
    username: '',
    email: '',
    telNum: '',
    password: '',
    gender: '',
    address: ''
  };
  errorMesage: string;

  signUpPop = true;

  constructor(private as: AuthService, private route: Router, private userser: UserService) { }

  ngOnInit(): void {
    if (this.route.url === '/signup') {
      this.signUpPop = true;
    }else {
      this.signUpPop = false;
    }
  }
  onSub(): void {
    this.as.signUp(this.signupForm.email, this.signupForm.password)
    .then((res) => {
      this.errorMesage = '';
      this.userser.addUser({
        id: res.user.uid,
        name: this.signupForm.username,
        email: this.signupForm.email,
        telNum: this.signupForm.telNum,
        gender: this.signupForm.gender,
        address: this.signupForm.address,
        buyTimes: 0
      });
      if (this.signUpPop) {
        this.route.navigate(['/home/main']);
      }else {
        this.as.loginConBol = false;
      }
    })
    .catch(err => this.errorMesage = err);
  }
}
