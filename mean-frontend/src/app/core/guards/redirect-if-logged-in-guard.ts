import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { ITokenData } from '../models/auth.model';

export const redirectIfLoggedInGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

   if (!authService.isloggedIn()) {
    return true;
  }

  let user!:ITokenData | null;
    authService.getAuthData().subscribe(data => user = data).unsubscribe();
  if (user?.role === 'admin') {
    return router.createUrlTree(['/dashboard']);
  }
  return router.createUrlTree(['/home']);
  
};
