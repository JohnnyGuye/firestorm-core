import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectFirebaseComponent } from './connect-firebase.component';

describe('ConnectFirebaseComponent', () => {
  let component: ConnectFirebaseComponent;
  let fixture: ComponentFixture<ConnectFirebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ConnectFirebaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
