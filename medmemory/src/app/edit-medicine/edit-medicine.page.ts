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
  medicamento: any; // Para almacenar los datos del medicamento
  id: string = ''; // Para almacenar el ID del medicamento
  count: number = 1; // Inicializa el contador
  horas: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private medicinesService: MedicinesService,
    private navCtrl: NavController,
    private fb: FormBuilder,
  ) {
    // Inicializa el formulario
    this.medicamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      frecuencia: ['', Validators.required],
      tipoDosis: ['', Validators.required],
      dosis: ['', Validators.required],
      horas: [[]], // Almacena las horas como un array
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') as string; // Obtén el ID de la URL
    this.loadMedicamento();
  }

  loadMedicamento() {
    if (this.id) {
      this.medicinesService.getMedicines().subscribe(medicines => {
        const medicamento = medicines.find(med => med.payload.doc.id === this.id);
        if (medicamento) {
          this.medicamento = medicamento.payload.doc.data(); // Almacena el medicamento
          this.medicamentoForm.patchValue({
            nombre: this.medicamento.nombre,
            tipoDosis: this.medicamento.tipoDosis,
            dosis: this.medicamento.dosis,
          });
        }
      });
    }
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

   // Lógica para actualizar el medicamento
   actualizarMedicamento() {
    
    if (this.medicamentoForm.valid) {
      const horasActualizadas = this.horas.map((_, index) => {
        const hora = this.medicamentoForm.get(`hora${index}Hora`)?.value;
        const minuto = this.medicamentoForm.get(`hora${index}Minuto`)?.value;
        return `${hora}:${minuto}`;
      });
      
      this.medicamentoForm.patchValue({ dosis: this.count,  horas: horasActualizadas });
      this.medicinesService.updateMedicine(this.id, this.medicamentoForm.value)
        .then(() => {
          alert('Medicamento actualizado exitosamente');
          //this.navCtrl.pop(); // Regresar a la lista de medicamentos o donde quieras
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
    // Navega al apartado de medicamentos (ajusta la ruta según tu estructura)
    this.navCtrl.pop();
  }
}