import { TestBed } from '@angular/core/testing';

import { PatientRefreshService } from './patient-refresh.service';

describe('PatientRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientRefreshService = TestBed.get(PatientRefreshService);
    expect(service).toBeTruthy();
  });
});
