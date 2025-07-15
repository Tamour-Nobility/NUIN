import { TestBed, inject } from '@angular/core/testing';

import { GvarsService } from './gvars.service';

describe('GvarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GvarsService]
    });
  });

  it('should be created', inject([GvarsService], (service: GvarsService) => {
    expect(service).toBeTruthy();
  }));
});
