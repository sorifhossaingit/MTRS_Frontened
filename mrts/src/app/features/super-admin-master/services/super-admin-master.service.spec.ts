import { TestBed } from '@angular/core/testing';

import { SuperAdminMasterService } from './super-admin-master.service';

describe('SuperAdminMasterService', () => {
  let service: SuperAdminMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
