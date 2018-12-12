import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ConfirmSignInComponent } from './confirm-sign-in/confirm-sign-in.component';
import { ConfirmSignUpComponent } from './confirm-sign-up/confirm-sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticatorComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'confirm-sign-in', component: ConfirmSignInComponent },
      { path: 'confirm-sign-up', component: ConfirmSignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'sign-out', component: SignOutComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AuthenticatorRoutingModule { }
