import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';

/**
 * A U T H E N T I C A T I O N   -    S E R V I C E
 *
 * Description:
 * Manages Firestore  -  LOGIN, LOGOUT, SINGUP (new User), RESET PASSWORD 
 * provides an Observable string for the userID of logged in User
 *
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userId: BehaviorSubject<string> = new BehaviorSubject(null);
  public readonly userId$: Observable<string> = this._userId.asObservable();

  private _email: BehaviorSubject<string> = new BehaviorSubject(null);
  public readonly email$: Observable<string> = this._userId.asObservable();

  constructor(public firebaseAuth: AngularFireAuth) { 
    let firestore = firebase.firestore();
    let settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    this.initializeUserId();
  }

  initializeUserId():void{
    firebase.auth().onAuthStateChanged( user => {
      if(user) {
        this._userId.next(user.uid);
      }
    });
  }

  setUserId(userId: string):void{
    this._userId.next(userId);
  }

  setEmail(email: string):void{
    this._email.next(email);
  }
  
  getUserId():string{
    return this._userId.getValue();
  }

  getEmail():string{
    return this._email.getValue();
  }

  signupUser(newUser: User, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, password)
      .then(newUserCredential => {
        console.log("User successfully created", newUserCredential)
        this.setUserId(newUserCredential.user.uid);

        firebase
        .firestore()
        .doc(`/users/${newUserCredential.user.uid}`)
        .set(newUser);
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }


  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logoutUser():Promise<void> {
    return firebase.auth().signOut();
  }

  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

}
