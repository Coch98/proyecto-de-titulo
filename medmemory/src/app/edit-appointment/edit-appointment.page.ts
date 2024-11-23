import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from '../services/appointments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.page.html',
  styleUrls: ['./edit-appointment.page.scss'],
})
export class EditAppointmentPage implements OnInit {
  appointmentForm: FormGroup;
  appointment: any; // Para almacenar los datos de la cita médica
  id: string = ''; // ID de la cita médica
  todayDate: string = new Date().toISOString().split('T')[0]; // Fecha mínima permitida

  constructor(
    private route: ActivatedRoute,
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    // Inicializar el formulario
    this.appointmentForm = this.fb.group({
      nombre: ['', Validators.required],
      nota: [''],
      fecha: ['', Validators.required],
      hora: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minuto: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.loadAppointment();
  }

  // Cargar datos de la cita médica
  loadAppointment() {
    if (this.id) {
      this.appointmentsService.getAppointments().subscribe(appointments => {
        const appointment = appointments.find(app => app.payload.doc.id === this.id);
        if (appointment) {
          this.appointment = appointment.payload.doc.data(); // Datos de la cita
          const [hora, minuto] = this.appointment.hora.split(':');
          this.appointmentForm.patchValue({
            nombre: this.appointment.nombre,
            nota: this.appointment.nota,
            fecha: this.appointment.fecha,
            hora,
            minuto,
          });
        }
      });
    }
  }

  // Guardar cambios
  actualizarCita() {
    if (this.appointmentForm.valid) {
      // Asegurar que la hora y los minutos tengan dos dígitos
      let hora = String(this.appointmentForm.value.hora).padStart(2, '0');
      let minuto = String(this.appointmentForm.value.minuto).padStart(2, '0');

      // Formatear la fecha al formato deseado
      const fechaOriginal = new Date(this.appointmentForm.value.fecha);
      const fechaFormateada = fechaOriginal.toLocaleDateString('es-ES');

      const updatedAppointment = {
        ...this.appointmentForm.value,
        fecha: fechaFormateada, // Fecha en formato dd/MM/yyyy
        hora: `${hora}:${minuto}`, // Hora en formato HH:mm
      };

      this.appointmentsService.updateAppointment(this.id, updatedAppointment)
        .then(() => {console.log('Cita médica actualizada exitosamente');} )
        .catch(err => console.error('Error actualizando la cita médica:', err));

      this.mostrarAlertaExito();
    }
  }

  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Cita médica actualizada exitosamente.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'custom-alert-button',
          handler: () => {
            this.navCtrl.navigateBack('/home');
          },
        },
      ],
      backdropDismiss: false,
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  // Confirmar eliminación
  async confirmarEliminacion(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta cita médica?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-cancel-button',
        },
        {
          text: 'Confirmar',
          cssClass: 'custom-delete-button',
          handler: () => {
            this.eliminarCita(id);
            setTimeout(() => this.alertaEliminacion(), 250);
          },
        },
      ],
      backdropDismiss: false,
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  async alertaEliminacion() {
    const alert = await this.alertController.create({
      header: 'Eliminado',
      message: 'La cita médica ha sido eliminada exitosamente.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'custom-alert-button',
          handler: () => {
            this.navCtrl.navigateBack('/home');
          },
        },
      ],
      backdropDismiss: false,
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  eliminarCita(id: string) {
    this.appointmentsService.deleteAppointment(id).catch(err =>
      console.error('Error eliminando la cita médica:', err)
    );
  }

  // Cancelar edición
  cancel() {
    this.navCtrl.pop();
  }

  limitInputLength(event: any) {
    const value = event.target.value;
    if (value.length > 2) {
      event.target.value = value.slice(0, 2);
    }
  }
}
