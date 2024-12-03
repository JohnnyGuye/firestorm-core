import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataStoragePageComponent } from './metadata-storage-page.component';

describe('MetadataStoragePageComponent', () => {
  let component: MetadataStoragePageComponent;
  let fixture: ComponentFixture<MetadataStoragePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataStoragePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetadataStoragePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
