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

  currentTheme = 'light';
  isDarkMode = false;

  themeOptions = [
    { value: 'light', label: 'Claro', icon: 'sunny' },
    { value: 'dark', label: 'Escuro', icon: 'moon' },
    { value: 'system', label: 'Sistema', icon: 'desktop' }
  ];

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.inicializarTema();
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

  verDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  async adicionarAoCarrinho(produto: any): Promise<void> {
    console.log('Produto adicionado ao carrinho:', produto);
    const toast = document.createElement('ion-toast');
    toast.message = `${produto.title} adicionado ao carrinho!`;
    toast.duration = 2000;
    toast.position = 'top';
    document.body.appendChild(toast);
    await toast.present();
  }

  getStarIcon(star: number, rating: number): string {
    return star <= Math.round(rating) ? 'star' : 'star-outline';
  }

  onThemeChange(event: CustomEvent): void {
    const newTheme = event.detail.value;
    this.currentTheme = newTheme;
    this.isDarkMode = newTheme === 'dark';

    // Aplica o tema
    document.body.classList.toggle('dark', this.isDarkMode);

    // Salva no localStorage
    localStorage.setItem('theme', newTheme);
  }

  inicializarTema(): void {
    const temaSalvo = localStorage.getItem('theme') || 'light';
    this.currentTheme = temaSalvo;
    this.isDarkMode = temaSalvo === 'dark';
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
