import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AppointmentsService } from '../services/appointments.service'; // Importa el servicio

// Define la interfaz para la cita médica
interface CitaMedica {
  nombre: string;
  nota: string;
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.page.html',
  styleUrls: ['./appointment-form.page.scss'],
})
export class AppointmentFormPage implements OnInit {
  appointmentForm: FormGroup;
  todayDate: string;

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    // Inicializa el formulario con validaciones
    this.appointmentForm = this.fb.group({
      nombre: ['', Validators.required],
      nota: ['', Validators.maxLength(500)],
      fecha: ['', Validators.required],
      hora: ['09', Validators.required],
      minuto: ['00', Validators.required]
    });

    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0]; 
  }

  ngOnInit() {}

  limitInputLength(event: any) {
    const value = event.target.value;
    if (value.length > 2) {
      event.target.value = value.slice(0, 2); // Limitar a 2 caracteres
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      // Obtener la hora y minuto del formulario y convertirlos a cadena de texto
      let hora = String(this.appointmentForm.value.hora);  // Aseguramos que es un string
      let minuto = String(this.appointmentForm.value.minuto);  // Aseguramos que es un string
  
      // Asegurar que tanto la hora como los minutos tengan dos dígitos
      hora = hora.padStart(2, '0');  // Agrega un 0 al inicio si la hora tiene un solo dígito
      minuto = minuto.padStart(2, '0');  // Agrega un 0 al inicio si los minutos tienen un solo dígito

      const fechaOriginal = new Date(this.appointmentForm.value.fecha);
      const fechaFormateada = fechaOriginal.toLocaleDateString('es-ES');
  
      const appointmentData: CitaMedica = {
        nombre: this.appointmentForm.value.nombre,
        nota: this.appointmentForm.value.nota,
        fecha: fechaFormateada, 
        hora: `${hora}:${minuto}`  // Guardar en formato HH:mm
      };
  
      // Guardar en Firestore usando el servicio
      this.appointmentsService.addAppointment(appointmentData).then(() => {
        console.log('Cita médica guardada exitosamente');
      }).catch(error => {
        console.error('Error al guardar la cita médica:', error);
      });

      this.mostrarAlertaExito();
      this.appointmentForm.reset();
    }
  }
  
  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Cita médica agregada exitosamente.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'custom-alert-button',
          handler: () => {
            this.navCtrl.navigateBack('/home');
          }
        }
      ],
      backdropDismiss: false,
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  cancel() {
    // Navega hacia atrás al cancelar
    this.navCtrl.pop();
  }
}
