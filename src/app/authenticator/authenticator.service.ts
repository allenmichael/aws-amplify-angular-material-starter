import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Auth } from 'aws-amplify';
import { AuthState, AuthStateEnum } from './models/AuthState';
import { ForgotPasswordResponse } from './models/ForgotPasswordResponse';
// import { Hub } from 'aws-amplify';

@Injectable()
export class AuthenticatorService {

  private _authState: BehaviorSubject<AuthState>;
  constructor(
    private router: Router
  ) {
    this._authState = new BehaviorSubject<AuthState>(
      new AuthState({ state: AuthStateEnum.unknown })
    );
    // AWS Amplify includes a Hub that tracks auth events.
    // You could also update your AuthState by monitoring this Hub.
    // Hub.listen('auth', this, 'AuthenticatorService');
  }
  // onHubCapsule(capsule) {
  //   const { channel, payload } = capsule;
  //   if (channel === 'auth') {
  //     console.log(payload);

  //     this._authState.next(
  //       new AuthState({ state: payload.event })
  //     );
  //     console.log(this._authState);
  //   }
  // }

  public async getAuthState(): Promise<BehaviorSubject<AuthState>> {
    if (!this._authState || this._authState.getValue().state === AuthStateEnum.unknown) {
      try {
        const user = await Auth.currentAuthenticatedUser();
        this._authState.next(
          new AuthState({
            state: AuthStateEnum.signedIn,
            user
          })
        );
      } catch (e) {
        console.log(e);
        await Auth.signOut();
        this._authState.next(
          new AuthState({
            state: AuthStateEnum.signedOut
          })
        );
      }
    }
    return this._authState;
  }

  public async resetAuthStateToSignIn() {
    Auth.signOut();
    this._authState.next(
      new AuthState({
        state: AuthStateEnum.signedOut
      })
    );
  }

  /** signup */
  public signUp(username, password, email, phone_number): Observable<any> {
    return fromPromise(Auth.signUp(username, password, email, phone_number))
      .pipe(
        catchError((err) => {
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signUpFailure
            }));
          console.log('throwing signup error: ' + err);
          throw err;
        }),
        tap((result) => {
          console.log('Signing up user: ');
          console.log(result.user);
          const user = result.user;
          if (!result.userConfirmed) {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.confirmSignUp,
                user
              }));
          } else {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.signedUp,
                user
              })
            );
          }
        }),
        map(result => result.user)
      );
  }

  /** confirm code */
  public confirmSignUp(username, code): Observable<any> {
    return fromPromise(Auth.confirmSignUp(username, code))
      .pipe(
        catchError((err) => {
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signUpFailure,
            })
          );
          console.log('throwing signup error: ' + err);
          throw err;
        }),
        tap((result) => {
          const user = result.user;
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signedUp,
              user
            })
          );
          return user;
        })
      );
  }

  public confirmSignIn(user, code, mfaType): Observable<any> {
    return fromPromise(Auth.confirmSignIn(user, code, mfaType))
      .pipe(
        catchError(err => {
          if (err.code === 'CodeMismatchException') {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.confirmSignInFailure,
                err: err
              }));
            return of(err);
          } else {
            throw err;
          }
        }),
        tap(result => {
          console.log('confirmed sign in: ');
          console.log(result);
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signedIn,
              user: result
            })
          );
        })
      );
  }

  public resendConfirmationCodeSignUp(username): Observable<any> {
    return fromPromise(Auth.resendSignUp(username))
      .pipe(
        tap(result => {
          console.log('resend confirmation code');
          console.log(result);
        })
      );
  }

  /** signin */
  public signIn(username: string, password): Observable<any> {
    return fromPromise(Auth.signIn(username, password))
      .pipe(
        catchError((err) => {
          console.log(err);
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signInFailure,
              err: err
            })
          );
          throw err;
        }),

        tap((auth) => {
          console.log(auth);
          if (auth.challengeName === 'SMS_MFA') {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.confirmSignIn,
                user: auth,
                mfaType: auth.challengeName
              }
              )
            );
          } else if (auth.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.newPasswordRequired,
                user: auth,
                mfaType: auth.challengeName
              })
            );
          } else {
            this._authState.next(
              new AuthState({
                state: AuthStateEnum.signedIn,
                user: auth
              }))
          }
        })
      );
  }

  public signOut(): Observable<void> {
    return fromPromise(Auth.signOut())
      .pipe(
        tap(result => {
          console.log(result);
          this._authState.next(
            new AuthState({
              state: AuthStateEnum.signedOut,
            })
          );
        }),
        catchError(error => {
          console.log(error);
          throw error;
        })
      );
  }

  public forgotPasswordSendMFACode(username: string): Observable<ForgotPasswordResponse> {
    // Auth.forgotPassword()
    return fromPromise(Auth.forgotPassword(username))
      .pipe(
        map(code => {
          console.log(code);
          if (code.CodeDeliveryDetails && code.CodeDeliveryDetails.DeliveryMedium) {
            console.log('sending full details.');
            return { delivered: true, medium: code.CodeDeliveryDetails.DeliveryMedium };
          } else {
            return { delivered: true }
          }
        })
      );
  }

  public forgotPasswordConfirmation(username: string, mfa: string, newPassword: string): Observable<any> {
    return fromPromise(Auth.forgotPasswordSubmit(username, mfa, newPassword));
  }

  /** get authenticat state */
  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(user => {
          console.log(user);
          return true;
        }),
        catchError(error => {
          console.log(error);
          return of(false);
        })
      );
  }

  private mfaDeliveryType(deliveryType: string): string {
    switch (deliveryType) {
      case 'SMS':
        return 'phone';
      default:
        return 'email';
    }
  }
}
