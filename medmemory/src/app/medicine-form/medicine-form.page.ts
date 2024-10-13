import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-medicine-form',
  templateUrl: './medicine-form.page.html',
  styleUrls: ['./medicine-form.page.scss'],
})
export class MedicineFormPage implements OnInit {

  medicamentoForm: FormGroup;
  horas: string[] = [];

  constructor(private fb: FormBuilder) {
    this.medicamentoForm = this.fb.group({
      nombre: ['', Validators.required],
      frecuencia: ['', Validators.required],
      dosis: ['', Validators.required]
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
      const medicamentoData = this.medicamentoForm.value;
      console.log('Medicamento guardado:', medicamentoData);
      // Aquí puedes enviar los datos a tu servicio de Firebase para guardar
      // ...
      
      // Limpiar el formulario
      this.medicamentoForm.reset();
      this.horas = [];
    }
  }
}
