import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private url = 'https://fakestoreapi.com/products';
  private todosProdutos: any[] = [];
  private totalItens = 0;

  constructor(private http: HttpClient) {}

  // Carrega todos os produtos uma única vez
  private carregarTodosProdutos(): Observable<any[]> {
    if (this.todosProdutos.length === 0) {
      return this.http.get<any[]>(this.url).pipe(
        map(produtos => {
          this.todosProdutos = produtos;
          this.totalItens = produtos.length;
          return produtos;
        })
      );
    }
    return new Observable(subscriber => {
      subscriber.next(this.todosProdutos);
      subscriber.complete();
    });
  }

  listarProdutos(pagina: number = 1, itensPorPagina: number = 8): Observable<{produtos: any[], total: number}> {
    return new Observable(subscriber => {
      this.carregarTodosProdutos().subscribe(produtos => {
        const inicio = (pagina - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const produtosPaginados = produtos.slice(inicio, fim);
        
        subscriber.next({
          produtos: produtosPaginados,
          total: this.totalItens
        });
        subscriber.complete();
      }, error => {
        subscriber.error(error);
      });
    });
  }

  // Retorna todos os produtos sem paginação
  listarTodosProdutos(): Observable<any[]> {
    return this.carregarTodosProdutos();
  }

  buscarProduto(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
}
