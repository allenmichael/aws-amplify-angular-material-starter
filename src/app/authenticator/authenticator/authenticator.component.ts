import { Component, OnInit, Input } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  errorMessage: string;
  constructor(
    private authService: AuthenticatorService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  async signIn() {
    await this.authService.resetAuthStateToSignIn();
    this.router.navigate(['auth']);
  }

  async signUp() {
    await this.authService.resetAuthStateToSignIn();
    this.router.navigate(['auth', 'sign-up']);
  }

  _setError(err) {
    if (!err) {
      this.errorMessage = null;
      return;
    }

    this.errorMessage = err.message || err;
  }

}
