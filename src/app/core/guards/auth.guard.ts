// src/app/core/guards/auth.guard.ts

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('accessToken');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/signin']);
};