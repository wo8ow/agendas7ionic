import { Component } from '@angular/core';
import { Acceso } from '../servicio/acceso';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  txt_usu: string = '';
  txt_cla: string = '';
  constructor(
    public servicio: Acceso,
    public navCtrl: NavController
  ) {}
  login() {
    let datos = {
      accion: 'loggin', // Ojo: en tu PHP lo tienes escrito con doble 'g' ('loggin')
      usuario: this.txt_usu,
      clave: this.txt_cla
    };

    this.servicio.sendData(datos, "persona").subscribe(
      (res: any) => {
        console.log("Respuesta de PHP:", res);
        
        // Ojo: En tu PHP devolvías true o false, no "ok"
        if (res && res.estado === true) { 
          this.servicio.createSession('idpersona', res.codigo);
          this.navCtrl.navigateRoot(['/menu']);
        } else {
          console.log("Credenciales incorrectas o error en el servidor");
          // Verifica que el método showToast exista en tu servicio
          this.servicio.showToast(res.mensaje, 2000); 
        } // <-- Aquí se cierra el else
      }, // <-- Aquí termina el bloque de éxito (res) y se separa por coma
      (error) => {
        console.error("Error en la solicitud HTTP:", error);
      } // <-- FALTABA CERRAR LA LLAVE DEL ERROR
    ); // <-- Cierre correcto del subscribe
  }
}
