import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFormAComponent } from './child-form-a.component';

describe('ChildFormAComponent', () => {
  let component: ChildFormAComponent;
  let fixture: ComponentFixture<ChildFormAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChildFormAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildFormAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
