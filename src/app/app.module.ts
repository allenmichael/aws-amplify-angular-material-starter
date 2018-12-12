import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';
import { AuthenticatorService } from './authenticator/authenticator.service';
import { AuthenticatorGuard } from './authenticator/authenticator.guard';
import { AuthenticatorModule } from './authenticator/authenicator.module';
import { AuthenticatedPageComponent } from './authenticated-page/authenticated-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    AppComponent,
    AuthenticatedPageComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AuthenticatorModule
  ],
  providers: [AuthenticatorGuard, AuthenticatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
