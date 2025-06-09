import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { CarrinhoService } from '../services/carrinho.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule, 
    PriceFormatPipe, 
    NavbarComponent,
    FormsModule
  ]
})
export class DetalhesPage implements OnInit {
  produto: any;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(parseInt(id));
    } else {
      this.carregando = false;
    }
  }

  async carregarProduto(id: number) {
    try {
      this.produto = await this.produtoService.buscarProduto(id).toPromise();
    } catch (erro) {
      console.error('Erro ao carregar produto', erro);
    } finally {
      this.carregando = false;
    }
  }

  quantidade: number = 1;

  async adicionarAoCarrinho() {
    if (this.produto) {
      // Criar um item de carrinho com os dados necessários
      const itemCarrinho = {
        id: this.produto.id,
        title: this.produto.title,
        price: this.produto.price,
        image: this.produto.image,
        description: this.produto.description,
        category: this.produto.category,
        rating: this.produto.rating,
        quantidade: Math.max(1, Math.min(100, this.quantidade || 1)) // Garante que a quantidade esteja entre 1 e 100
      };
      
      // Adiciona o item ao carrinho
      this.carrinhoService.adicionarItem(itemCarrinho);
      
      // Exibe um toast de confirmação
      const toast = await this.toastController.create({
        message: `${itemCarrinho.quantidade}x ${this.produto.title} adicionado ao carrinho!`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
        buttons: [
          {
            text: 'Ver Carrinho',
            handler: () => {
              this.router.navigate(['/carrinho']);
            }
          }
        ]
      });
      
      await toast.present();
      
      // Resetar a quantidade após adicionar ao carrinho
      this.quantidade = 1;
    }
  }
  
  aumentarQuantidade() {
    if (this.quantidade < 100) {
      this.quantidade++;
    }
  }
  
  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  getStarIcon(index: number, rating: number): string {
    if (index <= Math.floor(rating)) {
      return 'star';
    } else if (index - 0.5 <= rating) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }
}