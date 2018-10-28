import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(public firebaseAuth: AngularFireAuth) { 
    console.log("1. AuthService")
  }

  getUserId(){
    
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUserCredential => {
        firebase
        .firestore()
        .doc(`/userProfile/${newUserCredential.user.uid}`)
        .set({ email });
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
