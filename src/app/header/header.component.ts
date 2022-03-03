import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  private userSub: Subscription;
  error: string = null;
  userEmail: string = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });

    const userData: {
      email: string;
      id: string;
      displayName: string;
      registered: boolean;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.userEmail = userData.email;
    } else {
      this.userEmail = "";
    }

    console.log("User - " + this.userEmail);
    
  }

  onLogout() {
    this.authService.logout();
    this.error = null;
  }

}
