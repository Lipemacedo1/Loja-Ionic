import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  url = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  listarProdutos(): Observable<any> {
    return this.http.get(this.url);
  }

  buscarProduto(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
}
