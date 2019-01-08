import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FoodCalendarPage } from './food-calendar.page';
import { FoodSelectorPage } from '../../modals/food-selector/food-selector.page';

const routes: Routes = [
  {
    path: '',
    component: FoodCalendarPage
  }
];

@NgModule({
  entryComponents: [FoodCalendarPage, FoodSelectorPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FoodCalendarPage, FoodSelectorPage]
})
export class FoodCalendarPageModule {}
