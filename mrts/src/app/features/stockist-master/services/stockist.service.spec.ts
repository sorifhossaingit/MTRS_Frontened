import { TestBed } from '@angular/core/testing';

import { StockistService } from './stockist.service';

describe('StockistService', () => {
  let service: StockistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
