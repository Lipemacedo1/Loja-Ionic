import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PromocaoDirective } from '../directives/promocao.directive';

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
    NavbarComponent,
    PromocaoDirective
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
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!termo) {
      this.buscando = false;
      this.produtosFiltrados = [...this.produtos];
      return;
    }

    this.buscando = true;

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

  verDetalhes(produtoId: number): void {
    this.router.navigate(['/detalhes', produtoId]);
  }

  adicionarAoCarrinho(produto: any): void {
    // Lógica para adicionar ao carrinho
    console.log('Produto adicionado ao carrinho:', produto);
  }

  getStarIcon(star: number, rating: number): string {
    return star <= Math.round(rating) ? 'star' : 'star-outline';
  }
}