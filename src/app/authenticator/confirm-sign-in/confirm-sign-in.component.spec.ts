import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSignInComponent } from './confirm-sign-in.component';

describe('ConfirmSignInComponent', () => {
  let component: ConfirmSignInComponent;
  let fixture: ComponentFixture<ConfirmSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
