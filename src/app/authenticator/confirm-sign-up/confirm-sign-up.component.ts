import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthState, AuthStateEnum } from '../models/AuthState';
import { AuthenticatorService } from '../authenticator.service';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.css']
})
export class ConfirmSignUpComponent implements OnInit {
  _show: boolean;
  authState: AuthState;
  username: string;
  code: string;

  confirmSignUpForm: FormGroup;

  errorMessage: string;

  @Output() confirmed = new EventEmitter<boolean>();

  constructor(
    private authService: AuthenticatorService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
    this.setUsername();
    this.setCode();
  }

  createForm() {
    this.confirmSignUpForm = this._formBuilder.group({
      username: '',
      code: ''
    });
  }
  setUsername() {
    const nameControl = this.confirmSignUpForm.get('username');
    nameControl.valueChanges.forEach(
      (value: string) => {
        console.log(value);
        this.username = value;
      }
    );
  }
  setCode() {
    const nameControl = this.confirmSignUpForm.get('code');
    nameControl.valueChanges.forEach(
      (value: string) => {
        console.log(value);
        this.code = value;
      }
    );
  }

  async ngOnInit() {
    const stateMachine = await this.authService.getAuthState();
    stateMachine.subscribe(nextState => {
      console.log('checking current authstate...');
      console.log(nextState.state);
      if (nextState.user && nextState.user.username) {
        this.username = nextState.user.username;
      }
      this.authState = nextState;
      if (nextState.state === AuthStateEnum.signedIn) {
        console.log('switching to sign in dialog...');
        this.router.navigate(['../sign-in'], {
          relativeTo: this.route,
          queryParams: {
            username: this.username
          }
        });
      }
    });
    if (!this.username) {
      this.route.queryParams
        .pipe(filter(params => params.username))
        .subscribe(params => {
          console.log(params);

          this.username = params.username;
          console.log(this.username);
        });
    }
  }

  onConfirm() {
    this.authService.confirmSignUp(
      this.username,
      this.code
    )
      .subscribe(user => {
        console.log('Confirmed this user:');
        console.log(user);
        this.router.navigate(['/auth/sign-in'], { queryParams: { username: this.username } });
      }, err => {
        this._setError(err);
      });
  }

  onResend() {
    this.authService.resendConfirmationCodeSignUp(this.username)
      .subscribe(() => {
        console.log('Resent sign up confirmation code');
      }, err => {
        this._setError(err);
      });
    // .then(() => console.log('code resent'))
    // .catch(err => this._setError(err));
  }

  _setError(err) {
    if (!err) {
      this.errorMessage = null;
      return;
    }

    this.errorMessage = err.message || err;
  }
}
