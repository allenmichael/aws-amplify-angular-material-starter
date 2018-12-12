import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatorGuard } from './authenticator/authenticator.guard';
import { AuthenticatorRoutingModule } from './authenticator/authenticator-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthenticatedPageComponent } from './authenticated-page/authenticated-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'authenticated', component: AuthenticatedPageComponent, canActivate: [AuthenticatorGuard] },
];

@NgModule({
  imports: [
    AuthenticatorRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
