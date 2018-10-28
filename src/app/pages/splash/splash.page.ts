import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public splashScreen: SplashScreen,
    //public viewCtrl: ViewController,
    public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  
/*   ionViewDidEnter(){
    this.splashScreen.hide();

    setTimeout(() =>{
      this.viewCtrl._destroy();
    },4000);
  } */

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }


}
