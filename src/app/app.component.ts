import { Component } from '@angular/core';

import { Platform, AngularDelegate } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';
import { AuthService } from './services/user/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
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
      title: 'Einstellungen',
      url: '/settings',
      icon: 'settings'
    }
  ]



  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(environment.firebase);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
