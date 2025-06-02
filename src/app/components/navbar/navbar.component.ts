import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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
  isSearchOpen$ = this.searchService.isSearchOpen();
  searchTerm: string = '';
  isPromocao = false;
  private searchSubscription: Subscription | undefined;
  
  constructor(
    private searchService: SearchService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializa a busca com uma string vazia quando o componente é carregado
    this.searchService.getSearchTerm().pipe(take(1)).subscribe(term => {
      this.searchTerm = term;
    });
    
    // Verifica os parâmetros da rota para definir o estado de promoção
    this.searchSubscription = this.route.queryParams.subscribe(params => {
      this.isPromocao = params['promocao'] === 'true';
    });
  }

  ngOnDestroy(): void {
    // Limpa a inscrição para evitar vazamentos de memória
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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

  onSearchInput(event: any): void {
    const term = event.target?.value || '';
    this.searchService.setSearchTerm(term);
  }

  irParaHome(): void {
    this.router.navigate(['/home']);
  }

  irParaPromocao(): void {
    this.router.navigate(['/home'], { queryParams: { promocao: 'true' } });
  }

  closeSearch(): void {
    this.searchService.closeSearch();
    this.searchTerm = '';
    this.searchService.setSearchTerm('');
  }
}
