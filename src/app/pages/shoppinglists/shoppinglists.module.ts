import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShoppinglistsPage } from './shoppinglists.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ShareShoppinglistPage } from '../../modals/share-shoppinglist/share-shoppinglist.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppinglistsPage
  }
];

@NgModule({
  entryComponents: [ShareShoppinglistPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [ShoppinglistsPage, ShareShoppinglistPage]
})
export class ShoppinglistsPageModule {}
