import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/user/auth.service';
import { FcmService } from './services/fcm.service';

import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  // Array of all pages in the APP and MenuNavigations 
  public appPages = [
    {
      title: 'Speisen',
      url: '',
      icon: 'pizza'
    },
    {
      title: 'Speise-Kalender',
      url: '/food-calendar',
      icon: 'calendar'
    },
    {
      title: 'Einkaufslisten',
      url: '/shoppinglists',
      icon: 'basket'
    },    
    {
      title: 'Freunde',
      url: '/friends',
      icon: 'people'
    },
    {
      title: 'Benutzer-Profil',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'Einstellungen',
      url: '/settings',
      icon: 'settings'
    }
  ]

  // trigger for CSS splash animation -> HTML Template
  showSplash:boolean = true;

  // SUBSCRIPTIONS
  private listenToNotificationsOnWebSub: Subscription;
  private listenToNotificationsOnNativebSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public fcmService: FcmService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("initialized app")
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
     // this.statusBar.backgroundColorByHexString('#ffffff');

      this.splashScreen.hide();

      let timerSub =timer(4000).subscribe(() => {
        this.showSplash = false
        timerSub.unsubscribe();
      });
    });

    this.fcmService.getToken();

    // listen to notifications if user on ios or android
    if(this.platform.is('android') || this.platform.is('ios')){
      this.listenToNotificationsOnNativebSub = this.fcmService.listenToNotificationsOnNative().subscribe();
    }

    // listen to notifications if user on web
    if(!this.platform.is('cordova')){
      this.listenToNotificationsOnWebSub = this.fcmService.listenToNotificationsOnWeb().subscribe();
    }      
  }

  // LOGOUT from SideMenu
  logout(){
    if(this.listenToNotificationsOnNativebSub){
      this.listenToNotificationsOnNativebSub.unsubscribe();
    }
    if(this.listenToNotificationsOnWebSub){
      this.listenToNotificationsOnWebSub.unsubscribe();      
    }
    this.authService.logoutUser();
  }
}
