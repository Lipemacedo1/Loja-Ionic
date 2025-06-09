import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CarrinhoService } from '../../services/carrinho.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    IonicModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSearchOpen$ = new BehaviorSubject<boolean>(false);
  searchTerm: string = '';
  carrinhoItens: number = 0;
  private carrinhoSubscription: Subscription | undefined;
  private searchSubscription: Subscription | undefined;
  private _isPromocao: boolean = false;
  
  constructor(
    private searchService: SearchService,
    public router: Router,
    private route: ActivatedRoute,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    // Inicializa a busca com uma string vazia quando o componente é carregado
    this.searchService.getSearchTerm().pipe(take(1)).subscribe(term => {
      this.searchTerm = term;
    });

    // Inscreve-se nas mudanças de estado da busca
    this.searchService.isSearchOpen().subscribe(isOpen => {
      this.isSearchOpen$.next(isOpen);
    });

    // Inscreve-se nas mudanças de rota para verificar se está na página de promoção
    this.searchSubscription = this.route.queryParams.subscribe(params => {
      this._isPromocao = params['promocao'] === 'true';
    });

    // Inscreve-se nas atualizações do carrinho
    this.carrinhoSubscription = this.carrinhoService.getQuantidadeItens().subscribe(
      quantidade => {
        this.carrinhoItens = quantidade;
      }
    );
  }

  toggleSearch(): void {
    // Obtém o valor atual do Observable apenas uma vez
    this.isSearchOpen$.pipe(take(1)).subscribe(isOpen => {
      if (isOpen) {
        this.searchService.closeSearch();
      } else {
        this.searchService.openSearch();
      }
    });
  }
  
  // Fecha a busca quando o componente é destruído
  ngOnDestroy(): void {
    // Fecha a busca ao sair
    this.searchService.closeSearch();
    
    // Cancela todas as assinaturas
    if (this.carrinhoSubscription) {
      this.carrinhoSubscription.unsubscribe();
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchInput(event: any): void {
    const term = event.target?.value || '';
    this.searchTerm = term; // Atualiza o termo local
    this.searchService.setSearchTerm(term);
    
    // Navega para a home se não estiver nela
    if (!this.router.url.includes('home')) {
      this.router.navigate(['/home']);
    }
  }

  irParaHome(): void {
    this.router.navigate(['/home']);
  }

  get isPromocao(): boolean {
    return this._isPromocao;
  }
  
  get isCarrinho(): boolean {
    return this.router.url.includes('carrinho');
  }

  irParaPromocao(): void {
    // Se já estiver na página de promoção, volta para a página inicial sem filtros
    if (this.isPromocao) {
      this.router.navigate(['/home'], { queryParams: {} });
    } else {
      // Se não estiver na página de promoção, ativa o filtro
      this.router.navigate(['/home'], { queryParams: { promocao: 'true' } });
    }
  }

  closeSearch(): void {
    this.searchTerm = ''; // Limpa o termo de busca
    this.searchService.setSearchTerm(''); // Limpa o termo no serviço
    this.searchService.closeSearch();
    
    // Se estiver na home, recarrega os produtos sem filtro
    if (this.router.url.includes('home')) {
      this.router.navigate(['/home']);
    }
  }
}
