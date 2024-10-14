import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  hours: string[] = []; // Arreglo para horas
  minutos: string[] = []; // Arreglo para minutos

  constructor(private fb: FormBuilder, private medicinesService: MedicinesService) { // Inyecta el servicio
    this.medicamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      frecuencia: ['', Validators.required],
      tipoDosis: ['', Validators.required],
      dosis: [''],
    });
  }

  ngOnInit() {
    // Inicializar los arreglos de horas y minutos
    this.horas = [];
    this.hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? '0' : '') + i); // Horas de 00 a 23
    this.minutos = Array.from({ length: 60 }, (_, i) => (i < 10 ? '0' : '') + i); // Minutos de 00 a 59
  }

  onFrecuenciaChange(event: any) {
    const frecuencia = event.detail.value;
    this.horas = Array.from({ length: frecuencia }, (_, index) => `hora${index}`);
    
    // Reiniciar los controles de hora en el formulario
    this.horas.forEach((_, index) => {
      this.medicamentoForm.addControl(`hora${index}`, this.fb.control('', Validators.required));
      this.medicamentoForm.addControl(`minuto${index}`, this.fb.control('', Validators.required));
    });
  }

  onSubmit() {
    if (this.medicamentoForm.valid) {
      const medicamentoData = {
        ...this.medicamentoForm.value,
        dosis: this.count // Incluye la cantidad en los datos a guardar
      };
      
      // Guardar en Firestore usando el servicio
      this.medicinesService.addMedicine(medicamentoData).then(() => {
        console.log('Medicamento guardado exitosamente');
      }).catch(error => {
        console.error('Error al guardar el medicamento:', error);
      });

      // Guardar el medicamento en el array medicamentos
      this.medicamentos.push(medicamentoData);
      console.log('Medicamento guardado:', medicamentoData);

      this.medicamentoForm.reset();
      this.count = 0;
      this.horas = [];
    }
  }

  increment() {
    this.count += 1; // Aumenta el contador
  }

  decrement() {
    if (this.count > 0) {
      this.count -= 1; // Disminuye el contador solo si es mayor que 0
    }
  }
}
