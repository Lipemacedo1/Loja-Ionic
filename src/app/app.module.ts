import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { routes as appRoutes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'md',
        backButtonText: 'Voltar',
        backButtonIcon: 'arrow-back',
        animated: true
      })
    )
  ]
};

// Exportação padrão para compatibilidade com a importação em main.ts
export default appConfig;