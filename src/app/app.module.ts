import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from './core/services/theme.service';
import { ThemeToggleModule } from './components/theme-toggle/theme-toggle.module';

// Configuração inicial do tema
export function themeFactory(themeService: ThemeService) {
  return () => themeService.initializeTheme();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md', // Usa o design do Material Design
      backButtonText: 'Voltar',
      backButtonIcon: 'arrow-back',
      animated: true
    }),
    AppRoutingModule,
    HttpClientModule,
    ThemeToggleModule
  ],
  providers: [
    ThemeService,
    {
      provide: APP_INITIALIZER,
      useFactory: themeFactory,
      deps: [ThemeService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
