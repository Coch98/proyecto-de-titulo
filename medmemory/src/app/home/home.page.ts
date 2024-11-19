import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';
import { AppointmentsService } from '../services/appointments.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  medicamentos: any[] = [];
  citasMedicas: any[] = [];
  selectedCardId: string | null = null;
  userName: string | null = null;

  @ViewChild('tabs', { static: false }) tabs!: IonTabs;

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private alertCtrl: AlertController,
    private medicinesService: MedicinesService,
    private appointmentsService: AppointmentsService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((userData: any) => {
          this.userName = userData?.name || 'Usuario';
        });
      }
    });
  }

  cargarRecordatorios() {
    this.medicinesService.getMedicines().subscribe(data => {
      this.medicamentos = data.map(e => {
        const dataObj = e.payload.doc.data() as any;
        return {
          id: e.payload.doc.id,
          ...dataObj
        };
      });
    });
  }

  cargarCitasMedicas() {
    this.appointmentsService.getAppointments().subscribe(data => {
      this.citasMedicas = data.map(e => {
        const dataObj = e.payload.doc.data() as any;
        return {
          id: e.payload.doc.id,
          ...dataObj
        };
      });
    });
  }

  ionViewWillEnter() {
    this.cargarRecordatorios();
    this.cargarCitasMedicas();
  }
  
  async onLogout() {
    const alert = await this.alertCtrl.create({
      message: '¿Estás seguro que quieres cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'custom-cancel-button',
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logoutUser().then(() => {
              console.log('Sesión cerrada');
              this.navCtrl.navigateBack('/login');
            }).catch(error => {
              console.error('Error al cerrar sesión', error);
            });
          },
          cssClass: 'custom-logout-button'
        }
      ],
      cssClass: 'custom-alert',
    });

    await alert.present();
  }

  goToMedicineForm() {
    this.navCtrl.navigateForward('/medicine-form');
  }

  goToAppointmentForm(){
    this.navCtrl.navigateForward('/appointment-form')
  }

  editar(id: string) {
    this.selectedCardId = id;
    setTimeout(() => {
      this.navCtrl.navigateForward(`/edit-medicine/${id}`);
      this.selectedCardId = null;
    }, 150);
  }
}