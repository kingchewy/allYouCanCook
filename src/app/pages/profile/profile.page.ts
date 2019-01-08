import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../services/user/profile.service';
import { User } from '../../models/user';
import { PictureService } from '../../services/picture.service';
import { ToastController } from '@ionic/angular';

/**
 * P R O F I L E   -    P A G E
 * 
 * Description:
 * page subscribes in ProfileServices userProfile$ to display users Data
 * CRUD methods to modifiy user Data to firestore 
 * 
 * A Profile Picture can be taken and updloaded to Firestore Storage
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // observable user from profileservice
  private user: User;

  // trigger for editing userdata
  private editUserData: boolean = false;

  // imagepath for profilepicture
  private userImagePath: string;

  //SUBSCRIPTIONS
  private userSub: Subscription;

  constructor(
    private pictureService: PictureService,
    private profileService: ProfileService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  // Subscribes the userProfile$
  private getUserProfile():void{
    this.userSub = this.profileService.userProfile$.subscribe( userProfile => {
      if(userProfile){
        this.user = userProfile;
        this.loadUserPicture();
      }
    })
  }

  // loads user profilepicture
  private loadUserPicture():void{
    const userId = this.profileService.getUserId();

    this.pictureService.loadUserPicture(userId).then( picture => {
      this.userImagePath = picture;
    })
    .catch( error => {
      this.userImagePath = "";
    })
  }

  // triggers to enable editing userData ( from template )
  private editProfile():void{
    this.editUserData = !this.editUserData;
  }

  // call updateservice to save edited userdata to firstore ( from template )
  private updateProfile():void{
    this.editUserData = !this.editUserData;
    this.profileService.updateUserProfile(this.user).then( () => {
      console.log("Successfully updated UserProfile");      
    })
  }

  // calls pictureService to activate native camera for a profilepicture ( from template )
  private takePicture():void{
    this.pictureService.takeUserPicture().then( imageData => {
      const base64imageData = 'data:image/jpeg;base64,' + imageData;
      this.userImagePath = base64imageData;

      this.pictureService.storeUserPicture(this.user.id, base64imageData)
      .then( snapshot => {
        this.onUploadPresentToast('Profilbild erfolgreich hochgeladen.')
      }).catch( err => {
        this.onUploadPresentToast('Das Profilbild konnte nicht gespeichert werden.');
      })
    })
  }

  // toast message on uploading a picture ( success or fail )
  private async onUploadPresentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2000
    });
    toast.present();
  }

  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
