import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePage } from './home.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppointmentsService } from '../services/appointments.service';
import { NavController, AlertController } from '@ionic/angular';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let appointmentsServiceSpy: jasmine.SpyObj<AppointmentsService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;

  beforeEach(() => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => 'mockId' // ID simulado
        }
      }
    };

    const angularFirestoreMock = {
      collection: () => ({
        doc: () => ({
          valueChanges: () => of({ /* Datos simulados de la cita */ }),
          snapshotChanges: () => of([{ /* datos simulados */ }]),
          delete: () => Promise.resolve(),
        }),
        snapshotChanges: () => of([{ /* datos simulados */ }])
      })
    };

    appointmentsServiceSpy = jasmine.createSpyObj('AppointmentsService', ['getAppointments', 'updateAppointment', 'deleteAppointment']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'pop', 'navigateForward']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy },
        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, // Proporciona las opciones de Firebase aquí
        AppointmentsService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should navigate to medicine form', () => {
    component.goToMedicineForm();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/medicine-form');
  });

  it('should navigate to appointment form', () => {
    component.goToAppointmentForm();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/appointment-form');
  });

  it('should navigate to edit medicine', fakeAsync(() => {
    component.editar('1');
    tick(150);
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/edit-medicine/1');
  }));

  it('should navigate to edit appointment', fakeAsync(() => {
    component.editarCita('1');
    tick(150);
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/edit-appointment/1');
  }));

  it('should show logout confirmation alert', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    component.onLogout();
    tick();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  }));

});