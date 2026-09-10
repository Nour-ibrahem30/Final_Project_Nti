import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { IUser } from '../models/user.model';
import { ITokenData } from '../models/auth.model';

export const adminGaurd: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if(!token) return router.createUrlTree(['login']);

  let user!:ITokenData | null;
  authService.getAuthData().subscribe(data => user = data).unsubscribe();

  if(user?.role ==='admin'){
    return true
  }
  return router.createUrlTree(['/home']);

};
