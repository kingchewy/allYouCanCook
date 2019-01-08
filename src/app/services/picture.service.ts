import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadTask } from '@angular/fire/storage/interfaces';

/**
 * P I C T U R E    -    S E R V I C E
 *
 * Description:
 * This service provides access to the native camera and Firestore Storage
 * specific Camera Options according to type of pictures are managed here
 * ( e.g. Food pictures quality 70%, Profile Pictures quality 60% )
 * imageData = base64
 * 
 * provides CRUD methods to Firestore Storage
 *
 */

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  storageRef = firebase.storage().ref();

  constructor(
    private camera: Camera,
    private storage: AngularFireStorage
  ) { }

  public takeFoodPicture():Promise<any>{
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    return this.camera.getPicture(options)
  }

  public storeFoodPicture(foodId, base64imageData):UploadTask{
    return this.storageRef.child(`foods/${foodId}.jpg`).putString(base64imageData, 'data_url')

  }
  public loadFoodPicture(foodId):Promise<any>{
    return this.storage.ref(`foods/${foodId}.jpg`).getDownloadURL().toPromise()
  }


  public takeUserPicture():Promise<void>{
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    return this.camera.getPicture(options)
  }

  public storeUserPicture(userId, base64imageData):UploadTask{
    return this.storageRef.child(`users/${userId}.jpg`).putString(base64imageData, 'data_url')
  }

  public loadUserPicture(userId):Promise<any>{
    return this.storage.ref(`users/${userId}.jpg`).getDownloadURL().toPromise()
  }
}
