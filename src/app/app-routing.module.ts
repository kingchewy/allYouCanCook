import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'food-list', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule'},

  { 
    path: 'food-list', 
    loadChildren: './pages/food-list/food-list.module#FoodListPageModule',
    canActivate: [AuthGuard],
  },
  { 
    path: 'food-calendar', 
    loadChildren: './pages/food-calendar/food-calendar.module#FoodCalendarPageModule',
    canActivate: [AuthGuard],
 },
  { 
    path: 'food-selector', 
    loadChildren: './pages/food-selector/food-selector.module#FoodSelectorPageModule',
    canActivate: [AuthGuard],
  },
  { 
    path: 'food-create', 
    loadChildren: './pages/food-create/food-create.module#FoodCreatePageModule',
    canActivate: [AuthGuard],
  },
  { 
    path: 'shoppinglists', 
    loadChildren: './pages/shoppinglists/shoppinglists.module#ShoppinglistsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'food-details/:id',
    loadChildren: './pages/food-details/food-details.module#FoodDetailsPageModule',
    canActivate: [AuthGuard],
  },
  { 
    path: 'settings', 
    loadChildren: './pages/settings/settings.module#SettingsPageModule',
    canActivate: [AuthGuard],
  },
  { path: 'profile', 
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard], 
  },
  { path: 'splash', loadChildren: './pages/splash/splash.module#SplashPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
