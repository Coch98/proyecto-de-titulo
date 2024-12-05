import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppointmentFormPage } from './appointment-form.page';
import { AppointmentsService } from '../services/appointments.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavController, AlertController, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { DocumentReference } from '@angular/fire/compat/firestore';

describe('AppointmentFormPage', () => {
  let component: AppointmentFormPage;
  let fixture: ComponentFixture<AppointmentFormPage>;
  let appointmentsServiceSpy: jasmine.SpyObj<AppointmentsService>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    appointmentsServiceSpy = jasmine.createSpyObj('AppointmentsService', ['addAppointment']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['pop']);

    await TestBed.configureTestingModule({
      declarations: [AppointmentFormPage],
      imports: [ReactiveFormsModule, FormsModule, IonicModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: AppointmentsService, useValue: appointmentsServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should limit input length to 2 characters', () => {
    const inputEvent = { target: { value: '123' } };
    component.limitInputLength(inputEvent);
    expect(inputEvent.target.value).toBe('12'); // Se limita a 2 caracteres
  });

  it('should show success alert on successful submission', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    component.mostrarAlertaExito();
    tick();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(navCtrlSpy.pop).toHaveBeenCalled();
  });
  it('should handle error on add appointment', fakeAsync(() => {
    component.appointmentForm.setValue({
      nombre: 'Test Appointment',
      nota: 'Test Note',
      fecha: '2023-12-03',
      hora: '10',
      minuto: '00'
    });

    appointmentsServiceSpy.addAppointment.and.returnValue(Promise.reject('Error'));

    component.onSubmit();
    tick();

    expect(appointmentsServiceSpy.addAppointment).toHaveBeenCalled();
    // Aquí podrías verificar que se maneja el error correctamente, por ejemplo, con un mensaje de error en la consola
  }));
});