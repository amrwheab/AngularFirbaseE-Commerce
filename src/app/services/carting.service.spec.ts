import { TestBed } from '@angular/core/testing';

import { CartingService } from './carting.service';

describe('CartingService', () => {
  let service: CartingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
