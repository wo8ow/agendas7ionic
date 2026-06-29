import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';

@Component({
  selector: 'app-acontacto',
  templateUrl: './acontacto.page.html',
  styleUrls: ['./acontacto.page.scss'],
  standalone: false,
})
export class AcontactoPage implements OnInit {
  txt_nombre: string = '';
  txt_apellido: string = '';
  txt_telefono: string = '';

  constructor(
    private acceso: Acceso, 
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  async guardar() {
    if (!this.txt_nombre || !this.txt_apellido || !this.txt_telefono) {
      this.acceso.showToast('Por favor, llene todos los campos requeridos.');
      return;
    }

    const cod_persona = await this.acceso.getSession('idpersona');
    
    if (cod_persona) {
      let datos = {
        accion: 'insertar',
        cod_persona: cod_persona,
        nombre: this.txt_nombre,
        apellido: this.txt_apellido,
        telefono: this.txt_telefono
      };

      this.acceso.sendData(datos, 'contacto').subscribe((res: any) => {
        if (res.estado) {
          this.acceso.showToast(res.mensaje);
          this.navCtrl.navigateBack('/contacto'); // Retorna a la lista
        } else {
          this.acceso.showToast(res.mensaje);
        }
      });
    }
  }
}