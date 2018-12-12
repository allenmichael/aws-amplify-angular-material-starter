import { TestBed, async, inject } from '@angular/core/testing';

import { AuthenticatorGuard } from '../authenticator/authenticator.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatorGuard]
    });
  });

  it('should ...', inject([AuthenticatorGuard], (guard: AuthenticatorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
