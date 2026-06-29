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
      accion:'login',
      usuario: this.txt_usu,
      clave: this.txt_cla
    };
    this.servicio.sendData(datos,"persona").subscribe((res:any) => {
      if(res.estado == "ok") {
        this.servicio.createSession('idpersona',res.codigo)
        this.navCtrl.navigateRoot(['/menu'])
      }else {
        this.servicio.showToast(res.mensaje,2000) 
      }
    }) 
  }
}
