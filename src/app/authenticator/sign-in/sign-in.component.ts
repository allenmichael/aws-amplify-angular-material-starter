import { Component, OnInit, OnDestroy } from '@angular/core';
import { includes } from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthenticatorService } from '../authenticator.service';
import { AuthState, AuthStateEnum } from '../models/AuthState';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  authState: AuthState;
  showSignIn: boolean;
  hidePassword = true;
  username: string;
  password: string;
  errorMessage: string;
  signInForm: FormGroup;
  componentEnds: Subject<void> = new Subject();

  constructor(
    private authService: AuthenticatorService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
    this.setUsername();
    this.setPassword();
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
        this.authState = nextState;
        this.showSignIn = includes([
          AuthStateEnum.signIn,
          AuthStateEnum.signedOut,
          AuthStateEnum.signOut,
          AuthStateEnum.signedUp,
          AuthStateEnum.signInFailure,
        ], nextState.state);
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
            this.router.navigate(['auth']);
        }
      });
  }

  createForm() {
    this.signInForm = this._formBuilder.group({
      username: '',
      password: ''
    });
  }

  setUsername() {
    const nameControl = this.signInForm.get('username');
    nameControl.valueChanges.forEach(
      (value: string) => {
        console.log(value);
        this.username = value;
      }
    );
  }
  setPassword() {
    const passwordControl = this.signInForm.get('password');
    passwordControl.valueChanges.forEach(
      (value: string) => {
        console.log(value);
        this.password = value;
      }
    );
  }

  async onSignIn() {
    console.log(this.username);
    this.authService.signIn(this.username, this.password)
      .subscribe((user) => {
        console.log(user);
        this.router.navigate(['authenticated']);
      }, (err) => {
        console.log(err);
        this.errorMessage = err.message;
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
    console.log('Detaching sign in...');
    this.componentEnds.next();
    this.componentEnds.unsubscribe();
  }

}
