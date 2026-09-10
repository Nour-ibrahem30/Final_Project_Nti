import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGaurdGuard } from './admin-gaurd-guard';

describe('adminGaurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGaurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
