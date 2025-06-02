import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  private isSearchOpenSubject = new BehaviorSubject<boolean>(false);
  private promocaoFilterSubject = new BehaviorSubject<boolean>(false);

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  getSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  openSearch(): void {
    this.isSearchOpenSubject.next(true);
  }

  closeSearch(): void {
    this.isSearchOpenSubject.next(false);
    this.setSearchTerm('');
  }

  isSearchOpen(): Observable<boolean> {
    return this.isSearchOpenSubject.asObservable();
  }

  // Novos métodos para o filtro de promoção
  togglePromocaoFilter(): void {
    const currentValue = this.promocaoFilterSubject.value;
    this.promocaoFilterSubject.next(!currentValue);
  }

  getPromocaoFilter(): Observable<boolean> {
    return this.promocaoFilterSubject.asObservable();
  }

  resetFilters(): void {
    this.promocaoFilterSubject.next(false);
    this.searchTermSubject.next('');
  }
}
