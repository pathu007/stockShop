import { TestBed } from '@angular/core/testing';

import { GeneralServicesService } from './general-services.service';

describe('GeneralServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralServicesService = TestBed.get(GeneralServicesService);
    expect(service).toBeTruthy();
  });
});
