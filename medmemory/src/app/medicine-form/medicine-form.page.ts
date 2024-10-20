import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';  // Importa el servicio

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

  constructor(private fb: FormBuilder, private medicinesService: MedicinesService, private navCtrl: NavController) {
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
      const medicamentoData = {
        ...this.medicamentoForm.value,
        dosis: this.count,
      };
  
      // Convertir las horas a formato HH:mm
      const hoursArray = this.horas.map((_, index) => {
        // Obtén los valores y conviértelos a cadenas
        const hora = String(this.medicamentoForm.get(`hora${index}Hora`)?.value || '00');
        const minuto = String(this.medicamentoForm.get(`hora${index}Minuto`)?.value || '00');
        
        // Asegúrate de que ambos tengan al menos dos caracteres
        return `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`; // Formato HH:mm
      });
  
      // Agregar las horas al objeto de datos del medicamento
      medicamentoData.horas = hoursArray;
  
      // Guardar en Firestore usando el servicio
      this.medicinesService.addMedicine(medicamentoData).then(() => {
        console.log('Medicamento guardado exitosamente');
      }).catch(error => {
        console.error('Error al guardar el medicamento:', error);
      });
  
      this.medicamentos.push(medicamentoData);
      console.log('Medicamento guardado:', medicamentoData);
  
      this.medicamentoForm.reset();
      this.count = 1;
      this.horas = [];
    }
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
