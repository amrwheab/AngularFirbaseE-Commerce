import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users = [];

  formgroup = {
    email: '',
    password: ''
  };

  loginBol = true;

  errMessage;

  constructor(private as: AuthService, private route: Router) { }

  ngOnInit(): void {
    if (this.route.url === '/login') {
      this.loginBol = true;
    } else {
      this.loginBol = false;
    }
  }

  onSub(): void {
    this.as.login(this.formgroup.email, this.formgroup.password)
    .then(() => {
      this.errMessage = '';
      if (this.loginBol) {
        this.route.navigate(['/home/main']);
      } else {
        this.as.loginConBol = false;
      }
    })
    .catch(err => this.errMessage = err);
  }

}
