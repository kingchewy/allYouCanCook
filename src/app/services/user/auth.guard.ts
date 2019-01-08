import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AuthService } from './auth.service';

/**
 * A U T H E N T I C A T I O N   -    G U A R D
 *
 * Description:
 * Firebase "onAuthStateChanged" is used to check for the user login-state in the app,
 * to protect all routes after login/signup/password-reset.
 * 
 * Emits the returned userId to the "AuthService"
 * 
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  constructor(
    private router: Router,
    private authService: AuthService
  ){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User) => {
          if (user) {
            this.authService.setUserId(user.uid);
            this.authService.setEmail(user.email);
            console.log("AuthGUARD: User logged in! Able to access further components! \n UID = ",user.uid)
            resolve(true);
          } else {
            console.log('User is not logged in');
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      });
  }
}
