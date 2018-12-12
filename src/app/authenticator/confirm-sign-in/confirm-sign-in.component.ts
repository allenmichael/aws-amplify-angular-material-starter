import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticatorService } from '../authenticator.service';
import { AuthState, AuthStateEnum } from '../models/AuthState';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-sign-in',
  templateUrl: './confirm-sign-in.component.html',
  styleUrls: ['./confirm-sign-in.component.css']
})
export class ConfirmSignInComponent implements OnInit, OnDestroy {
  user: any;
  mfaCode: string;
  mfaType = 'SMS_MFA';
  showConfirmSignInForm: boolean;
  isSignedIn = false;
  confirmSignInForm: FormGroup;
  authState: AuthState;
  errorMessage: string;
  componentEnds: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticatorService,
    private _formBuilder: FormBuilder
  ) {
    this.createForm();
    this.setMFACode();
  }

  async ngOnInit() {
    const stateMachine = await this.authService.getAuthState();
    stateMachine
      .pipe(
        takeUntil(this.componentEnds)
      )
      .subscribe(nextState => {
        console.log('checking current authstate...');
        console.log(nextState.state);
        this.authState = nextState;
        switch (nextState.state) {
          case AuthStateEnum.unknown:
          case AuthStateEnum.signedOut:
          case AuthStateEnum.signedUp:
          case AuthStateEnum.confirmSignIn:
            if (!nextState.user) {
              break;
            }
            this.user = nextState.user;
            this.showConfirmSignInForm = true;
            break;
          case AuthStateEnum.confirmSignInFailure:
            this.showConfirmSignInForm = true;
            this._setError(nextState.err);
            break;
          case AuthStateEnum.signedIn:
            this.showConfirmSignInForm = false;
            this.isSignedIn = true;
            break;
        }
      });
  }

  createForm() {
    this.confirmSignInForm = this._formBuilder.group({
      mfaCode: ''
    });
  }

  setMFACode() {
    const nameControl = this.confirmSignInForm.get('mfaCode');
    nameControl.valueChanges.forEach(
      (value: string) => {
        console.log(value);
        this.mfaCode = value;
      }
    );
  }

  onConfirm() {
    this.authService
      .confirmSignIn(this.user, this.mfaCode, this.mfaType)
      .subscribe(user => {
        console.log(user);
        this.router.navigate(['']);
      }, err => {
        console.log(err);
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

  ngOnDestroy() {
    this.componentEnds.next();
    this.componentEnds.unsubscribe();
  }
}
