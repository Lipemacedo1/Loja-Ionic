import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CarrinhoItem {
  id: number;
  title: string;
  price: number;
  quantidade: number;
  image: string;
  description?: string;
  category?: string;
  rating?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoStateService {
  private carrinhoSubject = new BehaviorSubject<CarrinhoItem[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor() { 
    // Carregar carrinho do localStorage se existir
    this.carregarCarrinho();
  }

  private carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.carrinhoSubject.next(JSON.parse(carrinhoSalvo));
    }
  }

  private salvarCarrinho(carrinho: CarrinhoItem[]) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.carrinhoSubject.next(carrinho);
  }

  adicionarItem(item: CarrinhoItem) {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(i => i.id === item.id);

    if (itemExistente) {
      // Se o item já existe, incrementa a quantidade
      itemExistente.quantidade += item.quantidade;
    } else {
      // Se não existe, adiciona o novo item
      carrinhoAtual.push({...item});
    }

    this.salvarCarrinho([...carrinhoAtual]);
  }

  removerItem(index: number) {
    const carrinhoAtual = this.carrinhoSubject.value;
    carrinhoAtual.splice(index, 1);
    this.salvarCarrinho([...carrinhoAtual]);
  }

  atualizarQuantidade(index: number, quantidade: number) {
    const carrinhoAtual = this.carrinhoSubject.value;
    if (quantidade > 0) {
      carrinhoAtual[index].quantidade = quantidade;
      this.salvarCarrinho([...carrinhoAtual]);
    }
  }

  limparCarrinho() {
    this.salvarCarrinho([]);
  }

  getTotalItens(): number {
    return this.carrinhoSubject.value.reduce((total, item) => total + item.quantidade, 0);
  }

  getTotal(): number {
    return this.carrinhoSubject.value.reduce((total, item) => total + (item.price * item.quantidade), 0);
  }
}
