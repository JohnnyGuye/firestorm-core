import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTestComponent } from './dev-test.component';

describe('DevTestComponent', () => {
  let component: DevTestComponent;
  let fixture: ComponentFixture<DevTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
