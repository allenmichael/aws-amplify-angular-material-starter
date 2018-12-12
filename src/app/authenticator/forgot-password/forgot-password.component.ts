import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { AuthStateEnum } from '../models/AuthState';
import { Subject, pipe } from 'rxjs';
import { takeUntil, filter, catchError, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('stepper') stepper;
  isLinear = true;
  errorMessage: string;
  showForgotPasswordStart = true;
  showForgotPasswordVerify = false;
  showForgotPasswordConfirm = false;
  sentMFACode = false;
  hasMFACodeError = false;
  isSignedIn: boolean;
  username: string;
  mfaCode: string;
  newPassword: string;
  hidePassword = true;
  startForgotPasswordForm: FormGroup;
  enterMFAConfirmationCode: FormGroup;
  componentEnds = new Subject<void>();
  constructor(
    private authService: AuthenticatorService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.startForgotPasswordForm = this._formBuilder.group({
      username: ['', [Validators.required]]
    });
    this.enterMFAConfirmationCode = this._formBuilder.group({
      mfaCode: '',
      password: ['', [Validators.required]]
    });
  }

  selectionChange(evt) {
    // if (evt.previouslySelectedIndex === 0) {
    //   this.requestPasswordReset();
    // }
    // // if (evt.previouslySelectedIndex === 1) {
    // //   this.resetPassword();
    // // }
    // if (evt.selectedIndex === 0) {
    //   this.newPassword = "";
    // }
  }

  async ngOnInit() {
    this.route.queryParams
      .pipe(filter(params => params.username))
      .subscribe(params => {
        console.log(params);
        this.username = params.username;
        console.log(this.username);
      });
    const authStateMachine = await this.authService.getAuthState();
    authStateMachine
      .pipe(
        takeUntil(this.componentEnds)
      )
      .subscribe(nextState => {
        console.log('checking current authstate...');
        console.log(nextState.state);
        this.isSignedIn = nextState.state === AuthStateEnum.signedIn;
        switch (nextState.state) {
          case AuthStateEnum.confirmSignIn:
            console.log('switching to confirm sign in dialog...');
            this.router.navigate(['../confirm-sign-in'], {
              relativeTo: this.route
            });
            break;
          case AuthStateEnum.signInFailure:
            this._setError(nextState.err || 'Please try signing in again.');
            break;
          default:
            console.log('show forgot password.');
        }
      });
  }

  requestPasswordReset(isResend = false) {
    this.errorMessage = "";
    const usernameControl = this.startForgotPasswordForm.get('username');
    this.username = usernameControl.value;
    // this.showForgotPasswordStart = false;
    // this.showForgotPasswordVerify = true;
    console.log(this.username);
    this.authService.forgotPasswordSendMFACode(this.username)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.sentMFACode = resp.delivered;
          if (resp.medium) {
            console.log(resp.medium);
            this.snackBar.open(`Delivered MFA code to ${resp.medium}`, 'Dismiss', {
              duration: 4000,
            });
          }
          if (!isResend) {
            this.stepper.next();
          }
        },
        (err) => {
          this.hasMFACodeError = true;
          this.errorMessage = (err.message) ? err.message : err;
          this.stepper.reset();
        }
      );
  }

  resendMFACode() {
    this.requestPasswordReset(true)
  }

  resetPassword() {
    const codeControl = this.enterMFAConfirmationCode.get('mfaCode');
    this.mfaCode = codeControl.value;
    const passwordControl = this.enterMFAConfirmationCode.get('password');
    this.newPassword = passwordControl.value;
    this.authService.forgotPasswordConfirmation(this.username, this.mfaCode, this.newPassword)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.stepper.next();
        },
        (err) => {
          console.log(err);
          this.hasMFACodeError = true;
          this.errorMessage = (err.message) ? err.message : err;
          if (!(err.code === "ExpiredCodeException" ||
            err.code === "CodeMismatchException" ||
            err.code === "InvalidPasswordException")) {
            this.stepper.reset();
          }
        }
      )
  }

  redirectToSignIn() {
    this.router.navigate(['/auth/sign-in'], { queryParams: { username: this.username } });
  }

  _setError(err) {
    if (!err) {
      this.errorMessage = null;
      return;
    }

    this.errorMessage = err.message || err;
  }

}
