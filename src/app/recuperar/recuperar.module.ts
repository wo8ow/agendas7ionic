import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Necesario para el [(ngModel)]
import { IonicModule } from '@ionic/angular'; // <-- Necesario para las etiquetas <ion-...>

import { RecuperarPageRoutingModule } from './recuperar-routing.module';
import { RecuperarPage } from './recuperar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarPageRoutingModule
  ],
  declarations: [RecuperarPage]
})
export class RecuperarPageModule {}