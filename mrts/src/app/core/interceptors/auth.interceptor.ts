// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   // Get token from localStorage
//   const token = localStorage.getItem('token');

//   // If token exists
//   if (token) {

//     // Clone request and add Authorization header
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };


import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

let unauthorizedCount = 0;
let isRedirecting = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        unauthorizedCount++;

        console.log(`401 Count: ${unauthorizedCount}`);

        if (unauthorizedCount >= 3 && !isRedirecting) {
          isRedirecting = true;

          unauthorizedCount = 0;

          localStorage.clear();
          sessionStorage.clear();

          router.navigate(['/login']).finally(() => {
            isRedirecting = false;
          });
        }
      } else {
        // Reset counter if request succeeds with another error
        unauthorizedCount = 0;
      }

      return throwError(() => error);
    })
  );
};