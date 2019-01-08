import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { tap } from 'rxjs/operators';


import * as firebase from 'firebase/app';
import { AuthService } from './user/auth.service';
import { Firebase } from '@ionic-native/firebase/ngx';

/**
 * F C M
 * F I R E S T O R E   C L O U D   M E S S A G I N G  -  S E R V I C E
 *
 * Description:
 * TOKENS to register devices for Push Notifications are requested here
 * received Tokens are stored to users Firestore user-Doc
 * listening to Notifications, based on platform
 *
 */

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  token: string;
  
  constructor(
    public firebaseNative: Firebase,
    private afMessaging: AngularFireMessaging,
    public authService: AuthService,
    private toastController: ToastController,
    private platform: Platform,
    )
    {
      let firestore = firebase.firestore();
      let settings = {timestampsInSnapshots: true};
      firestore.settings(settings);
      
      this.afMessaging.messaging.subscribe(
        _messaging => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        }
      )
    }

  // Based on Platform, permission and token is requested
  async getToken():Promise<void> {
    let token: string;
    
    // platform ANDROID
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
      // TODO on tokenrefresh
    } 
  
    // platform IOS
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
      // TODO on tokenrefresh
    } 

    // all other platforms (Web, Win,....)
    if (!this.platform.is('cordova')) {
      return this.refreshAndSaveToken();
    }
    return this.saveTokenToFirestore(token)
  }

  // MANUALLY DELETE TOKEN
/*   deleteTokenButton(){
    debugger
    this.afMessaging.deleteToken('dH9Kr94KeHA:APA91bEiGGGcAZAsvGTkNr_ZDl9qyRd4tign0dZ79L__Sw5O6bCfOp8TZL-ThG9vh1M9ySzTBD32Q-xkz1UrH5t6iI1_7owJGxr3fGMVzlHeIUGLzNcQVvwBPOyZ0P-PjwKjXZLUF3nY')
    .subscribe();
  } */


  // Angular Fire Messaging "requestToken" requests permission and 
  // listens to new Tokens/Tokenchanges
  private async refreshAndSaveToken():Promise<void>{
    this.afMessaging.requestToken
    .subscribe(
      token => {
        console.log('Permission granted! Save to the server!', token);
        this.saveTokenToFirestore(token);
    },
      error =>  console.error( error )  
    );
  }

  // subscribe userId to get ID of userprofile to save the token
  private saveTokenToFirestore(token):void{
    const subscription = this.authService.userId$.subscribe( userId => {
      
      if(userId){
        this.updateToken(userId, token);

        if(subscription){
          subscription.unsubscribe();
        }          
      }
    });    
  }

  // saves the current/received token to Firestore user doc
  private updateToken(userId, token){
    const userRef = firebase.firestore().doc(`users/${userId}`);

    userRef.set({
      token: token
    }, {merge: true})
    .then( () => { console.log("Token successfully updated!")
    })
    .catch( error => { console.log(error) 
    });
  }

  // listen to Foreground notifications for iOS/Android
  listenToNotificationsOnNative():Observable<any>{
    //TODO based on platform return notificationtype
    return this.firebaseNative.onNotificationOpen().pipe(
      tap( msg => {
        this.makeToast(msg.body);
      })
    );
  }
  
  // listen to Foreground notifications for Web
  listenToNotificationsOnWeb():Observable<any>{
    return this.afMessaging.messages.pipe(
      tap( msg => {
        const body = msg.notification.body;
        this.makeToast(body);
      })
    );
  }

  // toast message for incoming notifications
  private async makeToast(message){
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'schließen'
    });
    toast.present();
  }
  
}
