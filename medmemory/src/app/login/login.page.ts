import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = {
    email: '',
    password: ''
  };

  passwordVisible = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async onLogin() {
    this.authService.loginUser(this.user)
      .then(() => {
        console.log('Login exitoso');
        this.navCtrl.navigateBack('/home');
      })
      .catch(async (error) => {
        console.log('Error en el inicio de sesión:', error);
        const alert = await this.alertCtrl.create({
          message: 'La combinación de correo y contraseña no corresponde. Vuelve a intentarlo.',
          buttons: [{
            text: 'OK',
            cssClass: 'custom-alert-button', // Clase CSS personalizada
          }],
          backdropDismiss: false,
          cssClass: 'custom-alert' // Clase CSS personalizada para el alert
        });
        await alert.present();
      });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Cambia el estado de visibilidad
  }
}
