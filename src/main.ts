import 'zone.js';  // 👈 ADICIONE ESTA LINHA NO TOPO

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes as appRoutes } from './app/routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideRouter(appRoutes),
    provideIonicAngular({
      mode: 'md',
      rippleEffect: true,
      animated: true
    })
  ]
}).catch(err => console.error(err));
