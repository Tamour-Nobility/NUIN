import { TestBed } from '@angular/core/testing';

import { AlertService } from './Alert.service';

describe('AlertmodalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertService = TestBed.get(AlertService);
    expect(service).toBeTruthy();
  });
});
