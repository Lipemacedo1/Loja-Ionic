import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get currentTheme(): string {
    return this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Inicializa o tema quando o aplicativo for carregado
      this.themeService.initializeTheme();
    }
  }
}
