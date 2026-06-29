import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';

@Component({
  selector: 'app-econtacto',
  templateUrl: './econtacto.page.html',
  styleUrls: ['./econtacto.page.scss'],
  standalone: false,
})
export class EcontactoPage implements OnInit {
  cod_contacto: string = '';
  txt_nombre: string = '';
  txt_apellido: string = '';
  txt_telefono: string = '';

  constructor(
    private router: Router,
    private acceso: Acceso,
    private navCtrl: NavController
  ) {
    // Interceptar el estado de navegación para poblar el formulario
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav && currentNav.extras.state && currentNav.extras.state['contacto']) {
      let c = currentNav.extras.state['contacto'];
      this.cod_contacto = c.codigo; 
      this.txt_nombre = c.nombre;
      this.txt_apellido = c.apellido;
      this.txt_telefono = c.telefono;
    }
  }

  ngOnInit() {}

  actualizar() {
    if (!this.txt_nombre || !this.txt_apellido || !this.txt_telefono) {
      this.acceso.showToast('Todos los campos son obligatorios.');
      return;
    }

    let datos = {
      accion: 'actualizar',
      cod_contacto: this.cod_contacto,
      nombre: this.txt_nombre,
      apellido: this.txt_apellido,
      telefono: this.txt_telefono
    };

    this.acceso.sendData(datos, 'contacto').subscribe((res: any) => {
      if (res.estado) {
        this.acceso.showToast(res.mensaje);
        this.navCtrl.navigateBack('/contacto');
      } else {
        this.acceso.showToast(res.mensaje);
      }
    });
  }
}