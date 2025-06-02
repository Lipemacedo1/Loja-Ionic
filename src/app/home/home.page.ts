import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PromocaoDirective } from '../directives/promocao.directive';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PriceFormatPipe,
    PromocaoDirective,
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
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
    this.iniciarBusca();
    
    // Verifica os parâmetros da rota para aplicar o filtro de promoção
    this.route.queryParams.subscribe(params => {
      const promocaoAtiva = params['promocao'] === 'true';
      this.aplicarFiltros(undefined, promocaoAtiva);
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  iniciarBusca(): void {
    // Configura a busca por termo
    this.searchSubscription = this.searchService.getSearchTerm().subscribe(termo => {
      this.aplicarFiltros(termo);
    });

    // Adiciona a subscrição para o filtro de promoção
    this.searchSubscription.add(
      this.searchService.getPromocaoFilter().subscribe(promocaoAtivo => {
        this.aplicarFiltros(undefined, promocaoAtivo);
      })
    );
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.listarProdutos().subscribe({
      next: (res: any) => {
        this.produtos = res;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos', err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(termoBusca?: string, promocaoAtivo: boolean = false): void {
    this.buscando = true;
    
    // Se não há termo de busca e nem filtro de promoção ativo, mostra todos os produtos
    if ((!termoBusca || termoBusca.trim() === '') && !promocaoAtivo) {
      this.produtosFiltrados = [...this.produtos];
      this.buscando = false;
      return;
    }
    
    // Aplica os filtros
    this.produtosFiltrados = this.produtos.filter(produto => {
      const buscaCorresponde = !termoBusca || 
        produto.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
        (produto.description && produto.description.toLowerCase().includes(termoBusca.toLowerCase()));
      
      const promocaoCorresponde = !promocaoAtivo || (produto.price && produto.price < 100);
      
      return buscaCorresponde && promocaoCorresponde;
    });
    
    this.buscando = false;
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