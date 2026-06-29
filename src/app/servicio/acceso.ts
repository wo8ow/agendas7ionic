import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';  
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Acceso {
  persona: string   = "http://localhost/WS26AGENDA/Api/persona.php";
  contacto: string = "http://localhost/WS26AGENDA/Api/contacto.php";
  server: string = "";
  constructor(private toastCtrl: ToastController, private http: HttpClient) {} 
    sendData(cuerpo: any, tabla: string) {
      if (tabla=="persona") {
        this.server = this.persona;
      }
      else {
        this.server = this.contacto;
      }
      let head= new HttpHeaders({'Content-Type': 'application/json'});
      let options = { headers: head };
      return this.http.post(this.server, JSON.stringify(cuerpo), options);
    }

    async createSession(id: string, valor: string) {
      await Preferences.set({
        key: id,
        value: valor,
      });
    } 
    async getSession(id: string) {
      const item = await Preferences.get({ key: id });
      return item.value;
    }
    async closeSession() {
      await Preferences.clear();
    }
    async showToast(mensaje: string, tiempo: number = 2000) {
      const toast = await this.toastCtrl.create({
        message: mensaje,
        duration: tiempo,
        position: 'top',
      });
      toast.present();
    }
}
