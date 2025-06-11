import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonSpinner,
  ToastController,
  IonText,
  IonInput
} from '@ionic/angular/standalone';
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
    FormsModule,
    RouterModule,
    PriceFormatPipe,
    NavbarComponent,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonSpinner,
    IonText,
    IonInput
  ]
})
export class DetalhesPage implements OnInit {
  produto: any;
  carregando = true;
  quantidade: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private toastController: ToastController
  ) {
    // Inicializa os ícones usados no componente
    this.initializeIcons();
  }

  private initializeIcons() {
    // Adiciona os ícones usados no template
    const icons = {
      'arrow-back': 'arrow-back',
      'pricetag': 'pricetag',
      'star': 'star',
      'star-half': 'star-half',
      'star-outline': 'star-outline',
      'remove': 'remove',
      'add': 'add',
      'cart': 'cart',
      'close': 'close'
    };
    
    // Adiciona os ícones diretamente no construtor
    // Isso é necessário porque o Ionic 7+ não suporta mais o addIcons global
    Object.entries(icons).forEach(([name, value]) => {
      if (!document.querySelector(`ion-icon[name="${name}"]`)) {
        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', value);
        icon.style.display = 'none';
        document.body.appendChild(icon);
      }
    });
  }

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

  getStarIcon(star: number, rating: number): string {
    if (star <= rating) {
      return 'star';
    } else if (star - 0.5 <= rating) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }

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
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      
      await toast.present();
    }
  }
}
