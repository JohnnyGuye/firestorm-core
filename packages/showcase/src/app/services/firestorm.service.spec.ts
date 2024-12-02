import { TestBed } from '@angular/core/testing';

import { FirestormService } from './firestorm.service';

describe('FirestormService', () => {
  let service: FirestormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
