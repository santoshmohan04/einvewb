import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoading = false;
  error: string = null;
  userEmail: string = "";

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {

  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.emlsg;
    const name = form.value.dispnm;
    const password = form.value.newsgpswd;
    const repassword = form.value.resgpswd;
    if (password !== repassword) {
      this.error = "The Passwords do not match";
    } else {
      let authObs: Observable<AuthResponseData>;

      this.isLoading = true;

      authObs = this.authService.signup(email, name, password);

      authObs.subscribe(
        resData => {
          console.log(resData);
          this.userEmail = resData.email;
          this.isLoading = false;
          alert("Registered Successfully kindly login");
          this.router.navigate(['/auth']);
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    }

    form.reset();
  }

  onSignin(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.eml;
    const password = form.value.pswd;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs = this.authService.login(email, password);

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.userEmail = resData.email;
        this.isLoading = false;
        this.router.navigate(['/einv']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onChange(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.emlfg;

      let authObs: Observable<AuthResponseData>;

      this.isLoading = true;

      authObs = this.authService.reset(email);

      authObs.subscribe(
        resData => {
          console.log(resData);
          if (resData.email) {
            this.isLoading = false;
            alert("Reset link Sent to email");
          }
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );

    form.reset();
  }

}
