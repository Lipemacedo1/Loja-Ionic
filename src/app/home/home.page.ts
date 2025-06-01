import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

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
    NavbarComponent
  ]
})
export class HomePage implements OnInit {
  produtos: any[] = [];
  carregando: boolean = true;

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.listarProdutos().subscribe({
      next: (res: any) => {
        this.produtos = res;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos', err);
        this.carregando = false;
      }
    });
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  adicionarAoCarrinho(produto: any): void {
    console.log('Produto adicionado ao carrinho:', produto);
    // Aqui você pode adicionar a lógica para adicionar ao carrinho
  }

  getStarIcon(star: number, rating: any): string {
    const rate = typeof rating === 'number' ? rating : rating?.rate || 0;
    return star <= Math.round(rate) ? 'star' : 'star-outline';
  }
}
