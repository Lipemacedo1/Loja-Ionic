import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    PriceFormatPipe,
    NavbarComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  carregando: boolean = true;
  buscando: boolean = false;
  private searchSubscription: Subscription | undefined;
  private searchTimeout: any = null;

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.iniciarBusca();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private iniciarBusca(): void {
    this.searchSubscription = this.searchService.getSearchTerm().subscribe(term => {
      if (this.produtos.length > 0) {
        this.filtrarProdutos(term);
      }
    });
  }

  private filtrarProdutos(termo: string): void {
    // Cancela o timeout anterior se existir
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Se o termo estiver vazio, mostra todos os produtos
    if (!termo) {
      this.buscando = false;
      this.produtosFiltrados = [...this.produtos];
      return;
    }

    // Mostra o indicador de busca
    this.buscando = true;

    // Adiciona um pequeno atraso para evitar buscas muito rápidas
    this.searchTimeout = setTimeout(() => {
      this.produtosFiltrados = this.produtos.filter(produto =>
        produto.title.toLowerCase().includes(termo) ||
        produto.description.toLowerCase().includes(termo) ||
        produto.category.toLowerCase().includes(termo)
      );
      this.buscando = false;
    }, 300);
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.listarProdutos().subscribe({
      next: (res: any) => {
        this.produtos = res;
        this.produtosFiltrados = [...this.produtos];
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos', err);
        this.carregando = false;
      }
    });
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  adicionarAoCarrinho(produto: any): void {
    console.log('Produto adicionado ao carrinho:', produto);
    // Aqui você pode adicionar a lógica para adicionar ao carrinho
  }

  getStarIcon(star: number, rating: any): string {
    const rate = typeof rating === 'number' ? rating : rating?.rate || 0;
    return star <= Math.round(rate) ? 'star' : 'star-outline';
  }
}
