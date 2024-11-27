import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';
import { LocalNotifications } from '@capacitor/local-notifications';

interface Medicamento {
  nombre: string;
  frecuencia: string;
  tipoDosis: string;
  dosis: number;
  horas: string[];
}

@Component({
  selector: 'app-medicine-form',
  templateUrl: './medicine-form.page.html',
  styleUrls: ['./medicine-form.page.scss'],
})
export class MedicineFormPage implements OnInit {
  medicamentoForm: FormGroup;
  medicamentos: any[] = [];
  count: number = 1;
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
    this.initializeNotifications();
  }

  async initializeNotifications() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Permisos concedidos para notificaciones.');
    } else {
      console.error('Permisos denegados.');
    }
  }

  ngOnInit() {
    this.horas = [];
  }

  onFrecuenciaChange(event: any) {
    const frecuencia = event.detail.value;
    this.horas = Array.from({ length: frecuencia }, (_, index) => `hora${index}`);
    this.horas.forEach((_, index) => {
      this.medicamentoForm.addControl(`hora${index}Hora`, this.fb.control('08', Validators.required));
      this.medicamentoForm.addControl(`hora${index}Minuto`, this.fb.control('00', Validators.required));
    });
  }

  limitInputLength(event: any) {
    const value = event.target.value;
    if (value.length > 2) {
      event.target.value = value.slice(0, 2);
    }
  }

  onSubmit() {
    if (this.medicamentoForm.valid) {
      const medicamentoData: Medicamento = {
        nombre: this.medicamentoForm.value.nombre,
        frecuencia: this.medicamentoForm.value.frecuencia,
        tipoDosis: this.medicamentoForm.value.tipoDosis,
        dosis: this.count,
        horas: [],
      };
  
      const hoursArray = this.horas.map((_, index) => {
        const hora = String(this.medicamentoForm.get(`hora${index}Hora`)?.value || '00').padStart(2, '0');
        const minuto = String(this.medicamentoForm.get(`hora${index}Minuto`)?.value || '00').padStart(2, '0');
        return `${hora}:${minuto}`;
      });
  
      medicamentoData.horas = hoursArray;
  
      this.medicinesService.addMedicine(medicamentoData).then(() => {
        console.log('Medicamento guardado exitosamente');
        this.scheduleNotifications(medicamentoData);
        this.mostrarAlertaExito();
        this.medicamentoForm.reset();
        this.count = 1;
        this.horas = [];
      }).catch(error => {
        console.error('Error al guardar el medicamento:', error);
      });
  
      this.medicamentos.push(medicamentoData);
      console.log('Medicamento guardado:', medicamentoData);
    }
  }
  
  scheduleNotifications(medicamento: Medicamento) {
    const notifications = medicamento.horas.map((hora, index) => {
      const [hour, minute] = hora.split(':').map(Number);
      const notificationTime = new Date();
      notificationTime.setHours(hour, minute, 0);
  
      return {
        title: "Recordatorio de Medicamento",
        body: `Es hora de tomar tu medicamento: ${medicamento.nombre}`,
        id: new Date().getTime() + index, // Genera un ID único basado en el tiempo actual
        schedule: { at: notificationTime },
        actionTypeId: "",
        extra: null
      };
    });
  
    LocalNotifications.schedule({ notifications });
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
            this.navCtrl.navigateBack('/home');
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
    this.navCtrl.pop();
  }
}