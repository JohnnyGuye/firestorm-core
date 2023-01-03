import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildFormBComponent } from './child-form-b.component';

describe('ChildFormBComponent', () => {
  let component: ChildFormBComponent;
  let fixture: ComponentFixture<ChildFormBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChildFormBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildFormBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
