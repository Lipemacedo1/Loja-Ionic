import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./detalhes/detalhes.page').then(m => m.DetalhesPage)
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

export { appRoutes };

export default appRoutes;
