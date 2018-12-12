import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthenticatorRoutingModule } from './authenticator-routing.module';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { MaterialModule } from '../material/material.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ConfirmSignInComponent } from './confirm-sign-in/confirm-sign-in.component';
import { ConfirmSignUpComponent } from './confirm-sign-up/confirm-sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticatorRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AuthenticatorComponent,
    SignInComponent,
    SignUpComponent,
    ConfirmSignInComponent,
    ConfirmSignUpComponent,
    SignOutComponent,
    ForgotPasswordComponent
  ],
  exports: [AuthenticatorComponent, SignInComponent, SignUpComponent, ConfirmSignInComponent, ConfirmSignUpComponent]
})
export class AuthenticatorModule { }
