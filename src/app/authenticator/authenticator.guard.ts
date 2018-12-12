
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthenticatorService } from './authenticator.service';

@Injectable()
export class AuthenticatorGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthenticatorService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      console.log('checking if user is authed');
      return this.auth.isAuthenticated()
        .pipe(
          tap(loggedIn => {
            if (!loggedIn) {
              this.router.navigate(['/auth']);
            }
          })
        );
  }
}
