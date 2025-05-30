import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // Importação adicionada
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PriceFormatPipe
  ]
})
export class HomePage implements OnInit {
  produtos: any[] = [];

  // Adicionado Router no construtor
  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (res: any) => {
        this.produtos = res;
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos', err);
      }
    });
  }

  // Implementação completa da navegação
  verDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }
}