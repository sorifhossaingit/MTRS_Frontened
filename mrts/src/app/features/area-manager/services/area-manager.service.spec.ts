import { TestBed } from '@angular/core/testing';

import { AreaManagerService } from './area-manager.service';

describe('AreaManagerService', () => {
  let service: AreaManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
