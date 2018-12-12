import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticatorService } from '../authenticator.service';
import { AuthState, AuthStateEnum } from '../models/AuthState';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isLinear = true;
  hidePassword = true;

  usernameForm: FormGroup;
  emailForm: FormGroup;
  phoneForm: FormGroup;
  passwordForm: FormGroup;
  authState: AuthState;
  authService: AuthenticatorService;
  _show: boolean;
  errorMessage: any;
  countryCodes = ['+1', '+44', '+33'];
  selectedCountryCode = this.countryCodes[0];
  confirmed = false;
  swapForConfirm = false;
  username: string;

  constructor(private authSerivce: AuthenticatorService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.usernameForm = this._formBuilder.group({
      username: ['', [Validators.required]]
    });
    this.emailForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.phoneForm = this._formBuilder.group({
      phone: ['', Validators.required],
      countryCode: ['', Validators.required]
    });
    this.passwordForm = this._formBuilder.group({
      password: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const stateMachine = await this.authSerivce.getAuthState();
    stateMachine.subscribe(nextState => {
      console.log('checking current authstate...');
      console.log(nextState.state);
      this.authState = nextState;
      if (nextState.state === AuthStateEnum.confirmSignUp) {
        console.log('switching to confirm sign in dialog...');
        this.router.navigate(['../confirm-sign-up'], {
          relativeTo: this.route,
          queryParams: {
            username: this.username
          }
        });
      }
    });
  }

  async onSignUp() {
    const usernameControl = this.usernameForm.get('username');
    const emailControl = this.emailForm.get('email');
    const [countryCodeControl, phoneControl] = ['countryCode', 'phone'].map((name) => this.phoneForm.get(name));
    const passwordControl = this.passwordForm.get('password');
    const username = usernameControl.value;
    this.username = username;
    const email = emailControl.value;
    const phone = `${countryCodeControl.value}${phoneControl.value}`;
    const password = passwordControl.value;
    console.log('creating user...');
    console.log(phone);

    this.authSerivce.signUp(username, password, email, phone)
      .subscribe(user => {
        console.log('Signing up user in component:');
        console.log(user);
      }, err => {
        this._setError(err);
      });
  }

  _setError(err) {
    if (!err) {
      this.errorMessage = null;
      return;
    }

    this.errorMessage = err.message || err;
  }
}
