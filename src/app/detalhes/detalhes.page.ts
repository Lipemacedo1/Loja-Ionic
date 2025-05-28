import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PriceFormatPipe } from '../pipes/price-format.pipe';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, PriceFormatPipe]
})
export class DetalhesPage {
  produto = {
    image: 'https://via.placeholder.com/150',
    title: 'Produto de Exemplo',
    price: 199.99,
    description: 'Descrição do produto de exemplo.'
  };
}
