import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private alertCtrl: AlertController, private navCtrl: NavController) {}
  
  cancelRegistration() {
    this.navCtrl.navigateBack('/home');
  }

  async onRegister() {
    // Simulación de registro exitoso
    const alert = await this.alertCtrl.create({
      header: 'Registro Exitoso',
      message: `Usuario ${this.user.name} registrado.`,
      buttons: ['OK']
    });
    await alert.present();

    // Limpiar los campos del formulario
    this.user = {
      name: '',
      email: '',
      password: ''
    };
  }
}
