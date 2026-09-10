import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(authService.isloggedIn()){
    return true;
  }

  localStorage.setItem('redirectAfterLogin',state.url);
  return router.createUrlTree(['/login'])

};
