import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'pages/dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./pages/configuration/configuration.page').then(
        (m) => m.ConfigurationPage
      ),
  },
  {
    path: 'vehicle',
    loadComponent: () =>
      import('./pages/vehicle/vehicle.page').then((m) => m.VehiclePage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'in-parking',
    loadComponent: () =>
      import('./pages/in-parking/in-parking.page').then((m) => m.InParkingPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs/tabs.routes').then((m) => m.tabsRoutes),
  },
];
