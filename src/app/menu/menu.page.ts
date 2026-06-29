import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  // Variables para almacenar los datos del usuario si deseas mostrarlos
  nombre: string = '';
  apellido: string = '';

  constructor(
    private navCtrl: NavController,
    private acceso: Acceso
  ) { }

  ngOnInit() {
    // La carga inicial puede permanecer aquí
  }

  async ionViewWillEnter() {
    // Al entrar al menú, consultamos quién inició sesión
    const cod_persona = (await this.acceso.getSession('idpersona')) || ''; 
    
    if (cod_persona) {
      let datos = { accion: 'consulta', cod_persona: cod_persona };
      this.acceso.sendData(datos, 'persona').subscribe((res: any) => {
        if (res && res.estado == true) {
          this.nombre = res.persona.nombre;
          this.apellido = res.persona.apellido;
        }
      });
    }
  }

  // --- CONTROLADORES DE NAVEGACIÓN ---

  // Método que redirige a la página de Contactos (Tu Agenda)
  abrirAgenda() {
    this.navCtrl.navigateForward('/contacto');
  }

  // Método opcional pero recomendado para salir de la app
  cerrarSesion() {
    this.acceso.closeSession();
    this.navCtrl.navigateRoot('/home'); // Retorna al Login y limpia el historial
  }
}