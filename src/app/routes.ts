import { Routes } from '@angular/router';

// Funções de carregamento assíncrono para lazy loading
export function loadHomePage() {
  return import('./home/home.page')
    .then(m => m.HomePage)
    .catch(err => {
      console.error('Erro ao carregar HomePage:', err);
      throw err;
    });
}

export function loadDetalhesPage() {
  return import('./detalhes/detalhes.page')
    .then(m => m.DetalhesPage)
    .catch(err => {
      console.error('Erro ao carregar DetalhesPage:', err);
      throw err;
    });
}

export function loadCarrinhoPage() {
  return import('./carrinho/carrinho.page')
    .then(m => m.CarrinhoPage)
    .catch(err => {
      console.error('Erro ao carregar CarrinhoPage:', err);
      throw err;
    });
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: loadHomePage,
  },
  {
    path: 'detalhes/:id',
    loadComponent: loadDetalhesPage,
  },
  {
    path: 'carrinho',
    loadComponent: loadCarrinhoPage,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
