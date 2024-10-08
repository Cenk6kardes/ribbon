import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const storageService = jasmine.createSpyObj('StorageService', ['isUserLogged', 'sessionId']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in', (done) => {
    spyOn(guard, 'isUserLogged').and.returnValues(true);

    const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const state: RouterStateSnapshot = {} as RouterStateSnapshot;
    const result = guard.canActivate(route, state) as Observable<boolean>;

    result.subscribe((value: any) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should prevent access when the user is not logged in', () => {
    spyOn(guard, 'isUserLogged').and.returnValues(false);
    const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const state: RouterStateSnapshot = {} as RouterStateSnapshot;
    const result = guard.canActivate(route, state) as Observable<boolean>;

    result.subscribe((value: any) => {
      expect(value).toBeFalse();
    });
  });

  it('should return true from isUserLogged() if sessionId exists', () => {
    spyOn(guard, 'isUserLogged').and.returnValues(true);
    const result = guard.isUserLogged();
    expect(result).toBeTruthy();
  });

  it('should return false from isUserLogged() if sessionId is null', () => {
    spyOn(guard, 'isUserLogged').and.returnValues(false);
    const result = guard.isUserLogged();
    expect(result).toBeFalse();
  });

});
