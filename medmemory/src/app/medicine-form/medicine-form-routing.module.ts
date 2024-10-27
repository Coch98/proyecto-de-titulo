import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicineFormPage } from './medicine-form.page';

const routes: Routes = [
  {
    path: '',
    component: MedicineFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicineFormPageRoutingModule {}
