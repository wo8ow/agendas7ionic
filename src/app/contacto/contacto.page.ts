import { Component, OnInit } from '@angular/core';
import { Acceso } from '../servicio/acceso'; // Verifica que la ruta sea correcta

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false,
})
export class ContactoPage implements OnInit {
  contactos: any = []; // Aquí guardaremos la lista de contactos

  constructor(private acceso: Acceso) { }

  ngOnInit() {
    // Se ejecuta al cargar la página por primera vez
  }

  // ionViewWillEnter asegura que se actualicen los datos cada vez que entres a esta pantalla
  ionViewWillEnter() {
    this.cargarContactos();
  }

  async cargarContactos() {
    // 1. Leemos la sesión
    const cod_persona = await this.acceso.getSession('idpersona'); 
    
    // RASTREADOR 1: Ver si el ID realmente está llegando
    console.log("1. ID recuperado de la memoria:", cod_persona); 

    if (cod_persona) {
      let datos = {
        accion: 'consultar',
        cod_persona: cod_persona
      };

      this.acceso.sendData(datos, 'contacto').subscribe((res: any) => {
        // RASTREADOR 2: Ver qué responde XAMPP/PHP
        console.log("2. Respuesta del servidor PHP:", res); 

        if (res.estado == true) {
          this.contactos = res.contactos; 
        } else {
          this.contactos = []; 
          this.acceso.showToast(res.mensaje);
        }
      }, (error) => {
        // RASTREADOR 3: Si la petición falla por red o CORS
        console.error("3. Error en la petición HTTP:", error);
      });
    } else {
      this.acceso.showToast("No se encontró la sesión del usuario.");
    }
  }
}