import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController} from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';  // Importa el servicio
import firebase from 'firebase/compat/app'; // Importa firebase para usar Timestamp

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

  constructor(private fb: FormBuilder, private medicinesService: MedicinesService, private navCtrl: NavController,) {
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
      this.medicamentoForm.addControl(`hora${index}`, this.fb.control('', Validators.required));
    });
  }

  onSubmit() {
    if (this.medicamentoForm.valid) {
      const medicamentoData = {
        ...this.medicamentoForm.value,
        dosis: this.count,
      };

      // Convertir las horas a objetos timestamp
      const hoursArray = this.horas.map((_, index) => {
        const horaValue = this.medicamentoForm.get(`hora${index}`)?.value; // Obtiene el valor de la hora
        return horaValue ? firebase.firestore.Timestamp.fromDate(new Date(horaValue)) : null; // Solo crea el Timestamp si hay un valor
      });

      // Agregar las horas al objeto de datos del medicamento
      medicamentoData.horas = hoursArray.filter(hora => hora !== null); // Filtra las horas nulas

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
