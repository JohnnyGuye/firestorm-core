import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTapConnectFirebaseButtonComponent } from './one-tap-connect-firebase-button.component';

describe('OneTapConnectFirebaseButtonComponent', () => {
  let component: OneTapConnectFirebaseButtonComponent;
  let fixture: ComponentFixture<OneTapConnectFirebaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OneTapConnectFirebaseButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneTapConnectFirebaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
