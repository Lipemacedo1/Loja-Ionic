import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
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
    path: 'carrinho',
    loadComponent: () => import('./carrinho/carrinho.page').then(m => m.CarrinhoPage)
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
