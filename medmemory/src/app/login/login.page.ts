import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  errorMessage: string = '';

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  async onLogin() {
    try {
      await this.authService.loginUser(this.user);
      this.navCtrl.navigateBack('/home'); // Redirigir a la página principal
    } catch (error: any) {
      this.errorMessage = error.message; // Mostrar el mensaje de error
    }
  }
}
