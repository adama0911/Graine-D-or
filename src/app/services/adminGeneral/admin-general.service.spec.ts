import { TestBed } from '@angular/core/testing';

import { AdminGeneralService } from './admin-general.service';

describe('AdminGeneralService', () => {
  let service: AdminGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
