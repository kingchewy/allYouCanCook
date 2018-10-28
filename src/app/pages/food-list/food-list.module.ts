import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FoodListPage } from './food-list.page';
import { OrderModule } from 'ngx-order-pipe';

const routes: Routes = [
  {
    path: '',
    component: FoodListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OrderModule
  ],
  declarations: [FoodListPage]
})
export class FoodListPageModule {}
