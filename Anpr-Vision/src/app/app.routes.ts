import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./splash/splash.component').then((m) => m.SplashComponent),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/authentication/pages/sign-in/sign-in.component').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import(
        './features/authentication/pages/verify-otp/verify-otp'
      ).then((m) => m.VerifyOtpPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicles.page').then( m => m.VehiclesPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'vehicle-details/:id',
    loadComponent: () => import('./features/vehicles/vehicle-details/vehicle-details.page').then( m => m.VehicleDetailsPage)
  },

];
