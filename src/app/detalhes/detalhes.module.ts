import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesPageRoutingModule } from './detalhes-routing.module';

import { DetalhesPage } from './detalhes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesPageRoutingModule,
    DetalhesPage   // <-- IMPORTE o componente standalone aqui!
  ],
  // NÃO DECLARE o componente standalone aqui!
})
export class DetalhesPageModule {}
