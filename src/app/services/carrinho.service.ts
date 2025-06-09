import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CarrinhoStateService, CarrinhoItem } from './carrinho-state.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  constructor(private carrinhoState: CarrinhoStateService) {}

  getItensCarrinho(): Observable<CarrinhoItem[]> {
    return this.carrinhoState.carrinho$;
  }

  getQuantidadeItens(): Observable<number> {
    return this.carrinhoState.carrinho$.pipe(
      map(itens => itens.reduce((total, item) => total + item.quantidade, 0))
    );
  }

  getTotalCarrinho(): Observable<number> {
    return this.carrinhoState.carrinho$.pipe(
      map(itens => itens.reduce((total, item) => total + (item.price * item.quantidade), 0))
    );
  }

  adicionarItem(item: Omit<CarrinhoItem, 'quantidade'>) {
    this.carrinhoState.adicionarItem({...item, quantidade: 1});
  }

  removerItem(index: number) {
    this.carrinhoState.removerItem(index);
  }

  atualizarQuantidade(index: number, quantidade: number) {
    this.carrinhoState.atualizarQuantidade(index, quantidade);
  }

  limparCarrinho() {
    this.carrinhoState.limparCarrinho();
  }
}
