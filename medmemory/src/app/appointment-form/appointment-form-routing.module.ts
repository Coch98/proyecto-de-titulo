import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentFormPage } from './appointment-form.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentFormPageRoutingModule {}
