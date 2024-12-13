import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { IonTabs } from '@ionic/angular';
import { MedicinesService } from '../services/medicines.service';
import { AppointmentsService } from '../services/appointments.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MedicamentoService } from '../services/medication-search.service';

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
  nombreMedicamento: string = '';
  resultado: any = null;
  error: string = '';
  mensajeError: string = ''; 

  @ViewChild('tabs', { static: false }) tabs!: IonTabs;

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private alertCtrl: AlertController,
    private medicinesService: MedicinesService,
    private appointmentsService: AppointmentsService,
    private firestore: AngularFirestore,
    private medicamentoService: MedicamentoService
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

  buscarMedicamento() {
    if (!this.nombreMedicamento.trim()) {
      console.error('Por favor, ingresa un nombre válido para buscar.');
      return;
    }

    this.medicamentoService.buscarMedicamento(this.nombreMedicamento).subscribe(
      (response: any) => {
        if (response.results && response.results.length > 0) {
          const medicamento = response.results[0];
          this.resultado = {
            brand_name: medicamento.openfda?.brand_name?.[0] || 'Nombre no disponible',
            generic_name: medicamento.openfda?.generic_name?.[0] || 'Nombre genérico no disponible',
            route: medicamento.openfda?.route?.[0] || 'Ruta de administración no disponible',
            purpose: medicamento.purpose?.[0] || 'Propósito no disponible',
            indications_and_usage: medicamento.indications_and_usage?.[0] || 'Indicaciones no disponibles',
            dosage_and_administration: medicamento.dosage_and_administration?.[0] || 'Dosificación no disponible',
            warnings: medicamento.warnings?.[0] || 'Advertencias no disponibles'
          };
        } else {
          this.resultado = null;
          console.error('No se encontraron resultados para este medicamento.');
        }
      },
      (error) => {
        console.error('Error al buscar el medicamento:', error);
        this.resultado = null;
        this.mensajeError = 'Medicamento no encontrado';
      }
    );
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

  editarCita(id: string) {
    this.selectedCardId = id;
    setTimeout(() => {
      this.navCtrl.navigateForward(`/edit-appointment/${id}`);
      this.selectedCardId = null;
    }, 150);
  }
  
}