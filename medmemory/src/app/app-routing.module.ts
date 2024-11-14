import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'medicine-form',
    loadChildren: () => import('./medicine-form/medicine-form.module').then( m => m.MedicineFormPageModule)
  },
  {
    path: 'edit-medicine/:id',
    loadChildren: () => import('./edit-medicine/edit-medicine.module').then( m => m.EditMedicinePageModule)
  },  {
    path: 'appointment-form',
    loadChildren: () => import('./appointment-form/appointment-form.module').then( m => m.AppointmentFormPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
