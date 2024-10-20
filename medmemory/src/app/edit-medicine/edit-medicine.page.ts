import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicinesService } from '../services/medicines.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-medicine',
  templateUrl: './edit-medicine.page.html',
  styleUrls: ['./edit-medicine.page.scss'],
})
export class EditMedicinePage implements OnInit {

  medicamentoForm: FormGroup;
  id: string = ''; // Para almacenar el ID del medicamento
  count: number = 1; // Inicializa el contador

  constructor(
    private route: ActivatedRoute,
    private medicinesService: MedicinesService,
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {
    // Inicializa el formulario
    this.medicamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      frecuencia: ['', Validators.required],
      tipoDosis: ['', Validators.required],
      dosis: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string; // Obtén el ID de la URL
    this.loadMedicamento();
  }

  onFrecuenciaChange(event: any) {
    const frecuencia = event.detail.value;
    
    // Reiniciar el FormArray
    const horasArray = this.medicamentoForm.get('horas') as FormArray;
    horasArray.clear(); // Limpiar horas anteriores

    // Establecer 00:00 como valor por defecto para cada hora
    for (let index = 0; index < frecuencia; index++) {
      horasArray.push(this.fb.control('00:00', Validators.required));
    }
  }

  loadMedicamento() {
    if (this.id) {
      this.medicinesService.getMedicines().subscribe(medicines => {
        const medicamento = medicines.find(med => med.payload.doc.id === this.id);
        if (medicamento) {
          const data = medicamento.payload.doc.data() as any; // Temporalmente indica que 'data' es de tipo 'any'
          this.medicamentoForm.patchValue({
            nombre: data.nombre,
            frecuencia: data.frecuencia,
            tipoDosis: data.tipoDosis,
            dosis: data.dosis,
          });

          // Cargar horas en el FormArray
          const horasArray = this.medicamentoForm.get('horas') as FormArray;
          data.horas.forEach((hora: string) => horasArray.push(this.fb.control(hora)));
        }
      });
    }
  }

  // Lógica para actualizar el medicamento
  actualizarMedicamento() {
    if (this.medicamentoForm.valid) {
      this.medicinesService.updateMedicine(this.id, this.medicamentoForm.value)
        .then(() => {
          alert('Medicamento actualizado exitosamente');
        })
        .catch(err => {
          console.error('Error actualizando el medicamento:', err);
        });
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
    this.navCtrl.pop();
  }
}
