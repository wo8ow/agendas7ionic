import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false,
})
export class RecuperarPage {
  usuario: string = '';
  pregunta: string = '';
  respuesta: string = '';
  nuevaClave: string = '';
  paso: number = 1; // 1: Pedir Cédula, 2: Responder pregunta

  constructor(private servicio: Acceso, private navCtrl: NavController) {}

  obtenerPregunta() {
    let datos = { accion: 'obtener_pregunta', usuario: this.usuario };
    this.servicio.sendData(datos, 'persona').subscribe((res: any) => {
      if (res && res.estado) {
        this.pregunta = res.pregunta;
        this.paso = 2;
      } else {
        this.servicio.showToast(res.mensaje);
      }
    });
  }

  restablecerClave() {
    let datos = {
      accion: 'restablecer_por_pregunta',
      usuario: this.usuario,
      respuesta: this.respuesta,
      nueva_clave: this.nuevaClave
    };
    this.servicio.sendData(datos, 'persona').subscribe((res: any) => {
      if (res && res.estado) {
        this.servicio.showToast(res.mensaje);
        this.navCtrl.navigateRoot(['/home']);
      } else {
        this.servicio.showToast(res.mensaje);
      }
    });
  }
}