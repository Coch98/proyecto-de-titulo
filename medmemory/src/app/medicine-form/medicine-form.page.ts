import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';  // Importa el servicio

// Define la interfaz para el medicamento
interface Medicamento {
  nombre: string;
  frecuencia: string;
  tipoDosis: string;
  dosis: number;
  horas: string[]; // Agrega la propiedad horas
}

@Component({
  selector: 'app-medicine-form',
  templateUrl: './medicine-form.page.html',
  styleUrls: ['./medicine-form.page.scss'],
})
export class MedicineFormPage implements OnInit {
  medicamentoForm: FormGroup;
  medicamentos: any[] = []; // Array para almacenar los medicamentos guardados
  count: number = 1; // Inicializa el contador
  horas: string[] = [];

  constructor(
    private fb: FormBuilder, 
    private medicinesService: MedicinesService, 
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.medicamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      frecuencia: ['', Validators.required],
      tipoDosis: ['', Validators.required],
      dosis: [this.count, Validators.required],
    });
  }

  ngOnInit() {
    this.horas = [];
  }

  onFrecuenciaChange(event: any) {
    const frecuencia = event.detail.value;
    this.horas = Array.from({ length: frecuencia }, (_, index) => `hora${index}`);
  
    // Reiniciar los controles de hora en el formulario
    this.horas.forEach((_, index) => {
      this.medicamentoForm.addControl(`hora${index}Hora`, this.fb.control('08', Validators.required));
      this.medicamentoForm.addControl(`hora${index}Minuto`, this.fb.control('00', Validators.required));
    });
  }

  limitInputLength(event: any) {
    const value = event.target.value;
    if (value.length > 2) {
      event.target.value = value.slice(0, 2); // Limitar a 2 caracteres
    }
  }
  
  onSubmit() {
    if (this.medicamentoForm.valid) {
      const medicamentoData: Medicamento = {
        nombre: this.medicamentoForm.value.nombre,
        frecuencia: this.medicamentoForm.value.frecuencia,
        tipoDosis: this.medicamentoForm.value.tipoDosis,
        dosis: this.count,
        horas: [], // Inicializa las horas aquí
      };
  
      // Convertir las horas a formato HH:mm y guardarlas en un array
      const hoursArray = this.horas.map((_, index) => {
        const hora = String(this.medicamentoForm.get(`hora${index}Hora`)?.value || '00').padStart(2, '0');
        const minuto = String(this.medicamentoForm.get(`hora${index}Minuto`)?.value || '00').padStart(2, '0');
        return `${hora}:${minuto}`; // Formato HH:mm
      });
  
      // Agregar solo el array de horas
      medicamentoData.horas = hoursArray;
  
      // Guardar en Firestore usando el servicio
      this.medicinesService.addMedicine(medicamentoData).then(() => {
        console.log('Medicamento guardado exitosamente');
      }).catch(error => {
        console.error('Error al guardar el medicamento:', error);
      });
  
      this.medicamentos.push(medicamentoData);
      console.log('Medicamento guardado:', medicamentoData);
      this.mostrarAlertaExito();
  
      this.medicamentoForm.reset();
      this.count = 1;
      this.horas = [];
    }
  }

  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Medicamento agregado exitosamente.',
      buttons: [
        {
          text: 'OK',
          cssClass: 'custom-alert-button',
          handler: () => {
            this.navCtrl.navigateBack('/home'); // Navega de regreso
          }
        }
      ],
      backdropDismiss: false,
      cssClass: 'custom-alert'
    });
  
    await alert.present();
  }
  
  decrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

  increment() {
    this.count++;
  }

  onCounterChange(event: any) {
    let value = event.target.value;
    if (value < 1) {
      this.count = 1;
    } else {
      this.count = value;
    }
  }

  cancel() {
    // Navega al apartado de medicamentos (ajusta la ruta según tu estructura)
    this.navCtrl.pop();
  }
}