import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFormCComponent } from './child-form-c.component';

describe('ChildFormCComponent', () => {
  let component: ChildFormCComponent;
  let fixture: ComponentFixture<ChildFormCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChildFormCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildFormCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
