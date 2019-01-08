import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShareShoppinglistPage } from './share-shoppinglist.page';

const routes: Routes = [
  {
    path: '',
    component: ShareShoppinglistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShareShoppinglistPage]
})
export class ShareShoppinglistPageModule {}
