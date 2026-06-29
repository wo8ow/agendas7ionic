import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // <-- 1. Importación necesaria de Ionic

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // <-- 2. Debe estar agregado en el arreglo de imports
    MenuPageRoutingModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}