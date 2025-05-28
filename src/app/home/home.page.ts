import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PriceFormatPipe } from '../pipes/price-format.pipe';  // Pipe customizado

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, PriceFormatPipe]
})
export class HomePage {
  produtos = [
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      title: 'Produto 1',
      price: 199.99,
      description: 'Descrição do Produto 1'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      title: 'Produto 2',
      price: 299.99,
      description: 'Descrição do Produto 2'
    }
  ];

  verDetalhes(id: number) {
    console.log('Ver detalhes do produto', id);
    // Navegação para a página de detalhes aqui
  }
}
