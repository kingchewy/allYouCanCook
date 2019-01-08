import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendsComponent } from './friends.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsComponent
  }
];

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FriendsComponent]
})
export class FriendsComponentModule {}
