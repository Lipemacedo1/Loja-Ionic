import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { PriceFormatPipe } from '../pipes/price-format.pipe';
import { HighlightDirective } from '../directives/highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,

    // IMPORTANDO componentes standalone corretamente:
    HomePage,
    PriceFormatPipe,
    HighlightDirective
  ]
})
export class HomePageModule {}
