import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { SearchService } from '../services/search.service';
import { CarrinhoService } from '../services/carrinho.service';
import { CarrinhoItem } from '../services/carrinho-state.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ToastController } from '@ionic/angular';

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
    NavbarComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  // Objeto para rastrear as quantidades de cada produto
  private quantidades: { [key: number]: number } = {};
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  carrinhoItens: number = 0; // Contador de itens no carrinho
  paginaAtual: number = 1;
  itensPorPagina: number = 8;
  totalItens: number = 0;
  totalPaginas: number = 0;
  carregando: boolean = true;
  buscando: boolean = false;
  private searchSubscription: Subscription | undefined;
  private searchTimeout: any = null;

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private carrinhoService: CarrinhoService,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    // Inscreve-se nas mudanças dos parâmetros da rota
    this.route.queryParams.subscribe(params => {
      const page = +params['page'] || 1;
      const promocaoAtiva = params['promocao'] === 'true';
      const busca = params['busca'] || '';
      
      // Atualiza os valores atuais
      this.paginaAtual = page;
      
      // Carrega os produtos da página atual
      this.carregarProdutos(page);
      
      // Aplica os filtros se necessário
      if (busca || promocaoAtiva) {
        this.aplicarFiltros(busca, promocaoAtiva);
      } else if (!busca && !promocaoAtiva) {
        // Se não houver busca nem promoção ativa, mostra todos os produtos da página
        this.produtosFiltrados = [...this.produtos];
      }
    });
    
    // Inscreve-se nas mudanças do termo de busca
    this.searchService.getSearchTerm().subscribe(term => {
      if (term !== null && term !== undefined) {
        // Atualiza a URL com o termo de busca
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { 
            busca: term || null,
            page: 1 // Volta para a primeira página ao buscar
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
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

  carregarProdutos(pagina: number = 1) {
    this.carregando = true;
    this.paginaAtual = pagina;
    
    this.produtoService.listarProdutos(pagina, this.itensPorPagina)
      .pipe(take(1))
      .subscribe({
        next: (response: {produtos: any[], total: number}) => {
          this.produtos = response.produtos;
          this.produtosFiltrados = [...this.produtos];
          this.totalItens = response.total;
          this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
          this.carregando = false;
          
          // Aplica os filtros atuais após carregar os produtos
          this.route.queryParams.pipe(take(1)).subscribe(params => {
            const promocaoAtiva = params['promocao'] === 'true';
            const termoBusca = params['busca'];
            this.aplicarFiltros(termoBusca, promocaoAtiva);
          });
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          this.carregando = false;
        }
      });
  }
  
  mudarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas && pagina !== this.paginaAtual) {
      // Atualiza a URL com o parâmetro de página
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: pagina },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
      
      // Recarrega os produtos para a página selecionada
      this.carregarProdutos(pagina);
      
      // Rola para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  aplicarFiltros(termoBusca?: string, promocaoAtivo: boolean = false): void {
    this.buscando = true;
    
    // Remove espaços em branco extras e verifica se o termo está vazio
    const termo = termoBusca ? termoBusca.trim() : '';
    
    // Se não há termo de busca e nem filtro de promoção ativo, mostra todos os produtos
    if (termo === '' && !promocaoAtivo) {
      this.produtosFiltrados = [...this.produtos];
      this.buscando = false;
      return;
    }
    
    // Se o filtro de promoção está ativo, carrega todos os produtos primeiro
    if (promocaoAtivo) {
      this.produtoService.listarTodosProdutos().subscribe({
        next: (todosProdutos: any[]) => {
          // Filtra os produtos em promoção
          let produtosFiltrados = todosProdutos.filter((produto: any) => 
            produto.price !== undefined && produto.price < 100
          );
          
          // Se houver termo de busca, aplica o filtro de busca também
          if (termo !== '') {
            const busca = termo.toLowerCase();
            produtosFiltrados = produtosFiltrados.filter((produto: any) => 
              (produto.title && produto.title.toLowerCase().includes(busca)) ||
              (produto.description && produto.description.toLowerCase().includes(busca))
            );
          }
          
          this.produtosFiltrados = produtosFiltrados;
          this.buscando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos em promoção:', error);
          this.buscando = false;
        }
      });
    } else if (termo !== '') {
      // Se não houver filtro de promoção, aplica apenas a busca nos produtos da página atual
      this.produtosFiltrados = this.produtos.filter((produto: any) => {
        const busca = termo.toLowerCase();
        return (produto.title && produto.title.toLowerCase().includes(busca)) ||
               (produto.description && produto.description.toLowerCase().includes(busca));
      });
      this.buscando = false;
    }
  }

  verDetalhes(id: number) {
    this.router.navigate(['/detalhes', id]);
  }

  // Obtém a quantidade atual de um produto
  getQuantity(productId: number): number {
    return this.quantidades[productId] || 1;
  }

  // Atualiza a quantidade de um produto
  updateQuantity(produto: any, change: number) {
    const currentQty = this.getQuantity(produto.id);
    const newQty = Math.max(1, currentQty + change);
    this.quantidades[produto.id] = newQty;
  }

  async adicionarAoCarrinho(produto: any, event: Event) {
    // Impede a propagação do evento para o card
    event.stopPropagation();
    
    const quantidade = this.getQuantity(produto.id);
    
    // Cria o item do carrinho com a quantidade selecionada
    const itemCarrinho: CarrinhoItem = {
      id: produto.id,
      title: produto.title,
      price: produto.price,
      image: produto.image,
      description: produto.description,
      category: produto.category,
      rating: produto.rating,
      quantidade: quantidade // Adiciona a quantidade ao item do carrinho
    };
    
    // Adiciona o item ao carrinho com a quantidade correta
    this.carrinhoService.adicionarItem(itemCarrinho);
    
    // Reseta a quantidade para 1 após adicionar ao carrinho
    this.quantidades[produto.id] = 1;
    
    // Atualiza o contador do carrinho
    this.atualizarContadorItens();
    
    // Exibe um toast de confirmação
    const toast = await this.toastController.create({
      message: quantidade > 1 ? 
        `${quantidade} itens de ${produto.title} adicionados ao carrinho!` :
        `${produto.title} adicionado ao carrinho!`,
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
  }
  
  private atualizarContadorItens() {
    this.carrinhoService.getQuantidadeItens().subscribe(quantidade => {
      this.carrinhoItens = quantidade;
    });
  }

  getStarIcon(star: number, rating: number): string {
    if (star <= Math.floor(rating)) {
      return 'star';
    } else if (star - 0.5 <= rating) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }

  irParaCarrinho(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/carrinho']);
  }
}