import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'ordenar',
        loadComponent: () =>
          import('../my-vehicle/my-vehicle.page').then((m) => m.MyVehiclePage),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('../user/user.page').then((m) => m.UserPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home', // 👈 redirect absoluto para evitar loop
        pathMatch: 'full',
      },
    ],
  },
];
