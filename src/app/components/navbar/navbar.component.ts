import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private searchSubscription: Subscription | undefined;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // Inicializa a busca com uma string vazia quando o componente é carregado
    this.searchService.setSearchTerm('');
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
    const searchTerm = event.target?.value || '';
    this.searchService.setSearchTerm(searchTerm.trim().toLowerCase());
  }

  closeSearch(): void {
    this.searchService.closeSearch();
    this.searchTerm = '';
    this.searchService.setSearchTerm('');
  }
}
