import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de tener este servicio creado
import { NavController, AlertController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  userName: string = '';
  medicamentos: any[] = [];  // Inicializa un array para los medicamentos

  // Obtén una referencia a IonTabs
  @ViewChild('tabs', { static: false }) tabs!: IonTabs;

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private alertCtrl: AlertController,
    private medicinesService: MedicinesService
  ) {}

   // Método que carga los medicamentos/recordatorios
   cargarRecordatorios() {
    this.medicinesService.getMedicines().subscribe(data => {
      this.medicamentos = data.map(e => {
        const dataObj = e.payload.doc.data() as any;  // Aseguramos que lo tratamos como objeto
        return {
          id: e.payload.doc.id,
          ...dataObj  // Hacemos el spread de los datos como objeto
        };
      });
    });
  }

  // ionViewWillEnter se llama cada vez que la vista está a punto de entrar
  ionViewWillEnter() {
    this.cargarRecordatorios();  // Cargar recordatorios cada vez que la vista se muestre
  }
  
  async onLogout() {
    const alert = await this.alertCtrl.create({
      message: '¿Estás seguro que quieres cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-cancel-button',  // Clase CSS para personalizar el botón
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logoutUser().then(() => {
              console.log('Sesión cerrada');
              this.navCtrl.navigateBack('/login'); // Redirigir a la página de inicio de sesión
            }).catch(error => {
              console.error('Error al cerrar sesión', error);
            });
          },
          cssClass: 'custom-logout-button'  // Clase CSS para personalizar el botón
        }
      ],
      cssClass: 'custom-alert',  // Clase CSS para el alert en general
    });

    await alert.present();
  }

  goToMedicineForm() {
    this.navCtrl.navigateForward('/medicine-form');
  }

  eliminar(id: string){
    this.medicinesService.deleteMedicine(id).then(res =>{
      alert("se elimino usuario")
    })
  }
}
