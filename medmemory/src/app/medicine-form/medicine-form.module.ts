import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MedicineFormPageRoutingModule } from './medicine-form-routing.module';

import { MedicineFormPage } from './medicine-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicineFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MedicineFormPage]
})
export class MedicineFormPageModule {}
