import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'food-list', pathMatch: 'full' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule'},
  { path: 'splash', loadChildren: './pages/splash/splash.module#SplashPageModule' },

  { 
    path: 'food-list', 
    loadChildren: './pages/food-list/food-list.module#FoodListPageModule',
    canActivate: [AuthGuard],
  },
      {
        path: 'fooddetails/:id',
        loadChildren: './pages/food-details/food-details.module#FoodDetailsPageModule',
        canActivate: [AuthGuard],
      },
  { 
    path: 'food-calendar', 
    loadChildren: './pages/food-calendar/food-calendar.module#FoodCalendarPageModule',
    canActivate: [AuthGuard],
  },
      { 
        path: 'food-selector', 
        loadChildren: './modals/food-selector/food-selector.module#FoodSelectorPageModule',
        canActivate: [AuthGuard],
      },
  { 
    path: 'shoppinglists', 
    loadChildren: './pages/shoppinglists/shoppinglists.module#ShoppinglistsPageModule',
    canActivate: [AuthGuard],
  },
      { 
        path: 'shoppinglist/:id', 
        loadChildren: './pages/shoppinglist/shoppinglist.module#ShoppinglistPageModule',
        canActivate: [AuthGuard],
      },
      { path: 'share-shoppinglist',
        loadChildren: './modals/share-shoppinglist/share-shoppinglist.module#ShareShoppinglistPageModule',
        canActivate: [AuthGuard],
      },
  {
    path: 'friends',
    loadChildren: './pages/friends/friends.module#FriendsComponentModule',
    canActivate: [AuthGuard],
  },
  { path: 'profile', 
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard], 
  },
  { 
    path: 'settings', 
    loadChildren: './pages/settings/settings.module#SettingsPageModule',
    canActivate: [AuthGuard],
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
