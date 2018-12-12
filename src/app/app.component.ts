import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from './authenticator/authenticator.service';
import { AuthState, AuthStateEnum } from './authenticator/models/AuthState';
import { includes } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  showSignIn = false;
  authState: AuthState;

  constructor(
    private authService: AuthenticatorService
  ) {
  }

  async ngOnInit() {
    const stateMachine = await this.authService.getAuthState();
    stateMachine.subscribe(nextState => {
      console.log('checking current authstate for nav...');
      console.log(nextState.state);
      this.authState = nextState;
      this.showSignIn = includes(
        AuthState.unauthenticatedStates(),
        nextState.state
      );
    });
  }
}
