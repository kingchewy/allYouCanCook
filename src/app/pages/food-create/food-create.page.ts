import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-food-create',
  templateUrl: './food-create.page.html',
  styleUrls: ['./food-create.page.scss'],
})
export class FoodCreatePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

/*   async createFood() {
    const loading = await this.loadingCtrl.create();
  
    const albumName = this.createSongForm.value.albumName;
    const artistName = this.createSongForm.value.artistName;
    const songDescription = this.createSongForm.value.songDescription;
    const songName = this.createSongForm.value.songName;
  
    this.firestoreService
      .createSong(albumName, artistName, songDescription, songName)
      .then(
        () => {
          loading.dismiss().then(() => {
            this.router.navigateByUrl('');
          });
        },
        error => {
          console.error(error);
        }
      );
  
    return await loading.present();
  } */

}
