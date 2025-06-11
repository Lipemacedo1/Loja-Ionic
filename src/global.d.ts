// Declarações de tipo para módulos dinâmicos
declare module './app/detalhes/detalhes.page' {
  import { Type } from '@angular/core';
  const DetalhesPage: Type<any>;
  export { DetalhesPage };
}

declare module './app/carrinho/carrinho.page' {
  import { Type } from '@angular/core';
  const CarrinhoPage: Type<any>;
  export { CarrinhoPage };
}
