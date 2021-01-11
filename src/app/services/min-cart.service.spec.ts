import { TestBed } from '@angular/core/testing';

import { MinCartService } from './min-cart.service';

describe('MinCartService', () => {
  let service: MinCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
