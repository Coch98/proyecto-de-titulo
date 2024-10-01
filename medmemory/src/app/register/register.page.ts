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
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}
  
  cancelRegistration() {
    this.navCtrl.navigateBack('/login');
  }

  onEmailChange() {
    this.errorMessage = '';
  }

  async onRegister() {
    this.errorMessage = '';
    try {
      await this.authService.registerUser(this.user);
      console.log('User registered successfully');

      // Mostrar un mensaje de éxito
      const alert = await this.alertCtrl.create({
        header: '¡Bienvenido a Medmory!',
        message: `${this.user.name} has sido registrado exitosamente.
                  Por favor, revisa tu correo para verificar tu cuenta.`,
        buttons: [
          {
            text: 'OK',
            cssClass: 'custom-alert-button',
            handler: () => {
              this.navCtrl.navigateBack('/login');
            },
        }],
        backdropDismiss: false,
        cssClass: 'custom-alert' 
      });
      await alert.present();
      

      // Limpiar los campos del formulario
      /*this.user = {
        name: '',
        email: '',
        password: ''
      };*/

    } catch (error: any) {
      if (error.message === 'Este correo ya está en uso') {
        this.errorMessage = 'Este correo ya está en uso'; // Mostrar el mensaje de error en el HTML
      } else {
        this.errorMessage = 'Error al registrar el usuario'; // Mostrar un mensaje genérico de error
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Cambia el estado de visibilidad
  }
}