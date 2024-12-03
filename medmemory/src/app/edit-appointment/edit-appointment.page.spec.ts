import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditAppointmentPage } from './edit-appointment.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AppointmentsService } from '../services/appointments.service';
import { FormBuilder } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

describe('EditAppointmentPage', () => {
  let component: EditAppointmentPage;
  let fixture: ComponentFixture<EditAppointmentPage>;
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
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'pop']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      declarations: [EditAppointmentPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy },
        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, // Proporciona las opciones de Firebase aquí
        AppointmentsService,
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success alert on successful update', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    component.mostrarAlertaExito();
    tick();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  }));

  it('should confirm deletion', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    component.confirmarEliminacion('mockId');
    tick();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  }));

  it('should handle error on delete appointment', fakeAsync(() => {
    appointmentsServiceSpy.deleteAppointment.and.returnValue(Promise.reject('Error'));

    try {
      component.eliminarCita('mockId');
      tick();
    } catch (error) {}
   
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(navCtrlSpy.pop).toHaveBeenCalled();
  });

  it('should limit input length to 2 characters', () => {
    const event = { target: { value: '123' } };
    component.limitInputLength(event);

    expect(event.target.value).toBe('12');
  });
});