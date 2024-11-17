import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AppointmentFormPageRoutingModule } from './appointment-form-routing.module';

import { AppointmentFormPage } from './appointment-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AppointmentFormPage]
})
export class AppointmentFormPageModule {}
