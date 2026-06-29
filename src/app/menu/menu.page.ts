import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Acceso } from '../servicio/acceso';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {
  id_persona: string ="";
  datospersona: any = [];
  nombre: string = "";
  contactos: any = [];
  constructor(
    public servicio: Acceso,
    public navCtrl: NavController,
  ) {
    this.servicio.getSession('idpersona').then((res:any) => {
      this.id_persona = res;
      this.dpersona(this.id_persona);
      this.lcontactos(this.id_persona);
    })
  }
  ngOnInit() {}

  dpersona(id_persona: string) {
    let datos = {
      accion: 'consulta', // ⚠️ Verifica en tu persona.php cómo se llama exactamente esta acción ('consulta', 'datos', etc.)
      cod_persona: id_persona  // ⚠️ Verifica cómo espera recibir PHP tu ID
    };
    this.servicio.sendData(datos, 'persona').subscribe((res: any) => {
      console.log("Repuesta de PHP en Menu:",res);
      if(res && res.estado ==true){
        this.datospersona = res.persona;
        this.nombre = this.datospersona.nombre + " " + this.datospersona.apellido;
      }
    });
  }

  lcontactos(id_persona: string) {
    let datos = {
      accion: 'consultar', 
      cod_persona: id_persona
    };
    this.servicio.sendData(datos, 'contacto').subscribe((res: any) => {
      if(res.estado){
        this.contactos=res.contactos
      }
      else{
        this.servicio.showToast(res.mensaje,3000);
        console.log("No se pudieron cargar los datos del usuario o la respuesta fue null");
      }
    })
  }
}
