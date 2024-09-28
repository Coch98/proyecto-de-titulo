import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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

  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}
  
  cancelRegistration() {
    this.navCtrl.navigateBack('/home');
  }

  async onRegister() {
    try {
      await this.authService.registerUser(this.user);
      console.log('User registered successfully');

      // Mostrar un mensaje de éxito
      const alert = await this.alertCtrl.create({
        header: 'Registro Exitoso',
        message: `Usuario ${this.user.name} registrado.`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateBack('/home'); // Redirigir a /home
          }
        }]
      });
      await alert.present();

      // Limpiar los campos del formulario
      this.user = {
        name: '',
        email: '',
        password: ''
      };

    } catch (error) {
      console.error('Error registering user:', error);
      // Opcional: Manejar el error y mostrar un mensaje al usuario
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Cambia el estado de visibilidad
  }
}