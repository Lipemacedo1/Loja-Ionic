import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CarrinhoService } from '../services/carrinho.service';
import { CarrinhoItem } from '../services/carrinho-state.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CarrinhoPage implements OnInit, OnDestroy {
  carrinho: CarrinhoItem[] = [];
  total: number = 0;
  carregando: boolean = false;
  private carrinhoSubscription: Subscription | undefined;

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnDestroy() {
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.carregando = true;
    
    // Inscrever-se nas atualizações do carrinho
    this.carrinhoSubscription = this.carrinhoService.getItensCarrinho().subscribe({
      next: (itens: CarrinhoItem[]) => {
        this.carrinho = [...itens];
        this.calcularTotal();
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar carrinho', erro);
        this.carregando = false;
      }
    });
  }

  private atualizarContadorItens(): void {
    // O contador agora é atualizado automaticamente pelo serviço
  }

  calcularTotal(): void {
    this.carrinhoService.getTotalCarrinho().subscribe((total: number) => {
      this.total = total;
    });
  }

  async removerItem(index: number): Promise<void> {
    const itemRemovido = this.carrinho[index];
    this.carrinhoService.removerItem(index);
    
    // Exibir mensagem de item removido
    const toast = await this.toastController.create({
      message: `${itemRemovido.title} removido do carrinho`,
      duration: 2000,
      position: 'bottom',
      color: 'warning',
      icon: 'trash',
      buttons: [
        {
          icon: 'undo',
          text: 'Desfazer',
          handler: () => {
            // Reverter a remoção
            this.carrinhoService.adicionarItem(itemRemovido);
          }
        }
      ]
    });
    
    await toast.present();
  }

  atualizarQuantidade(item: CarrinhoItem, event: Event): void {
    const inputElement = event.target as HTMLIonInputElement;
    const value = parseInt(inputElement.value as string, 10);
    if (value && value >= 1) {
      const index = this.carrinho.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.carrinhoService.atualizarQuantidade(index, value);
      }
    }
  }

  async finalizarCompra() {
    try {
      // Exibir mensagem de confirmação
      const toast = await this.toastController.create({
        message: 'Compra finalizada com sucesso!',
        duration: 2000,
        position: 'bottom',
        color: 'success',
        icon: 'checkmark-circle'
      });
      
      // Limpar carrinho após finalizar
      this.carrinhoService.limparCarrinho();
      
      // Navegar de volta para a página inicial
      await this.router.navigate(['/home']);
      
      // Mostrar mensagem de sucesso
      await toast.present();
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      
      // Exibir mensagem de erro
      const toast = await this.toastController.create({
        message: 'Ocorreu um erro ao finalizar a compra. Tente novamente.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
        icon: 'alert-circle'
      });
      
      await toast.present();
    }
  }

  aumentarQuantidade(item: CarrinhoItem): void {
    const index = this.carrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.carrinhoService.atualizarQuantidade(index, item.quantidade + 1);
    }
  }

  diminuirQuantidade(item: CarrinhoItem): void {
    if (item.quantidade > 1) {
      const index = this.carrinho.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.carrinhoService.atualizarQuantidade(index, item.quantidade - 1);
      }
    }
  }
}
