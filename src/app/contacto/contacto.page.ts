import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false,
})
export class ContactoPage implements OnInit {
  contactos: any = [];

  constructor(
    private acceso: Acceso,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarContactos();
  }

  async cargarContactos() {
    const cod_persona = await this.acceso.getSession('idpersona'); 
    if (cod_persona) {
      let datos = { accion: 'consultar', cod_persona: cod_persona };
      this.acceso.sendData(datos, 'contacto').subscribe((res: any) => {
        if (res.estado == true) {
          this.contactos = res.contactos; 
        } else {
          this.contactos = []; 
        }
      });
    }
  }

  // --- NAVEGACIÓN Y CRUD ---

  // Forzar la navegación al formulario de creación
  nuevoContacto() {
    this.navCtrl.navigateForward('/acontacto');
  }

  // Navegar a edición llevando los datos del contacto
  editarContacto(contacto: any) {
    this.navCtrl.navigateForward('/econtacto', { state: { contacto: contacto } });
  }

  // Cuadro de confirmación nativo para eliminar
  async confirmarEliminar(contacto: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Deseas eliminar a ${contacto.nombre} de tu agenda?`,
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel' 
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarContacto(contacto.codigo);
          }
        }
      ]
    });
    await alert.present();
  }

  // Llamada al backend PHP para eliminar definitivamente
  eliminarContacto(cod_contacto: string) {
    let datos = { accion: 'eliminar', cod_contacto: cod_contacto };
    this.acceso.sendData(datos, 'contacto').subscribe((res: any) => {
      this.acceso.showToast(res.mensaje);
      if (res.estado) {
        this.cargarContactos(); // Actualiza la lista si se eliminó con éxito
      }
    });
  }
}