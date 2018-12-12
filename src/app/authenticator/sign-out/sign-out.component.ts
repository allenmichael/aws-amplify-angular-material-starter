import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthState, AuthStateEnum } from '../models/AuthState';
import { AuthenticatorService } from '../authenticator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit, OnDestroy {
  authState: AuthState;
  componentEnds: Subject<void> = new Subject();
  private componentEnded: Subject<void> = new Subject();
  constructor(
    private authService: AuthenticatorService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.authService.signOut()
      .pipe(
        takeUntil(this.componentEnds)
      )
      .subscribe(() => {
        console.log('signed out!');
      });
  }

  ngOnDestroy() {
    this.componentEnds.next();
    this.componentEnds.unsubscribe();
  }

}
