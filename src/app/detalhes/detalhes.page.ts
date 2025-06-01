import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { ProdutoService } from '../services/produto.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule, 
    PriceFormatPipe, 
    NavbarComponent
  ]
})
export class DetalhesPage implements OnInit {
  produto: any;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(parseInt(id));
    } else {
      this.carregando = false;
    }
  }

  async carregarProduto(id: number) {
    try {
      this.produto = await this.produtoService.buscarProduto(id).toPromise();
    } catch (erro) {
      console.error('Erro ao carregar produto', erro);
    } finally {
      this.carregando = false;
    }
  }

  getStarIcon(index: number, rating: number): string {
    if (index <= Math.floor(rating)) {
      return 'star';
    } else if (index - 0.5 <= rating) {
      return 'star-half';
    } else {
      return 'star-outline';
    }
  }
}