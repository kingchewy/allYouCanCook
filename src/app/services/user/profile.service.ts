import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from '../../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * P R O F I L E   -   S E R V I C E
 *
 * Description:
 * loads Users Profile vom Firestore
 * provides the UserProfile as Observable
 * provides mehtods to get and set User Data
 * 
 */

@Injectable({
  providedIn: 'root'
})
export class ProfileService{

  private refUsers: firebase.firestore.CollectionReference;

  // Observable User-Profile from BehaviourSubject
  private _userProfile: BehaviorSubject<User> = new BehaviorSubject(null);
  public readonly userProfile$: Observable<User> = this._userProfile.asObservable();


  constructor(
    public firebaseAuth: AngularFireAuth,
    public authService: AuthService
    ) {    
    let firestore = firebase.firestore();
    let settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    console.log("profileService")

    this.refUsers = firebase.firestore().collection('users');
    this.loadInitialUserProfile();
  }
  
  // request and listen to changes of userProfile from Firestore
  loadInitialUserProfile():void{
    
    this.refUsers.doc(this.authService.getUserId())
    .onSnapshot( snapshot => {
      let userFromFirestore = snapshot.data();
      
      let userProfile: User = {
        id: snapshot.id,
        email: userFromFirestore.email,
        firstname: userFromFirestore.firstname,
        lastname: userFromFirestore.lastname,
        nickname: userFromFirestore.nickname,
        birthdate: new Date(userFromFirestore.birthdate).toISOString(),
        friends: userFromFirestore.friends,
        token: userFromFirestore.token,
        createdAt: userFromFirestore.createdAt,
      }

      this._userProfile.next(userProfile);
    });    
  }

  getEmailAddress():string{
    return this._userProfile.getValue().email
  }

  getUserId():string{
    return this._userProfile.getValue().id
  }
  
  changeFirstname(firstname: string):Promise<void>{
    return this.refUsers.doc(this.authService.getUserId()).update({
      firstname
    })
  }

  changeLastname(lastname: string):Promise<void>{
    return this.refUsers.doc(this.authService.getUserId()).update({
      lastname
    })
  }

  changeBirthdate(birthdate: string):Promise<void>{
    return this.refUsers.doc(this.authService.getUserId()).update({
      birthdate
    })
  }

  changeDisplayname(nickname: string):Promise<void>{
    return this.refUsers.doc(this.authService.getUserId()).update({
      nickname
    })
  }

  updateUserProfile(user: User):Promise<void>{
    return this.refUsers.doc(this.authService.getUserId()).set({
      birthdate: user.birthdate,
      firstname: user.firstname,
      lastname: user.lastname,
      nickname: user.nickname
    }, {merge: true});
  }


}
