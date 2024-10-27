import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditMedicinePage } from './edit-medicine.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MedicinesService } from '../services/medicines.service';
import { NavController, AlertController } from '@ionic/angular';

describe('EditMedicinePage', () => {
  let component: EditMedicinePage;
  let fixture: ComponentFixture<EditMedicinePage>;
  let medicinesServiceSpy: jasmine.SpyObj<MedicinesService>;
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
          valueChanges: () => of({ /* Datos simulados del medicamento */ }),
          snapshotChanges: () => of([{ /* datos simulados */ }]),
          delete: () => Promise.resolve(),
        }),
        snapshotChanges: () => of([{ /* datos simulados */ }])
      })
    };

    medicinesServiceSpy = jasmine.createSpyObj('MedicinesService', ['getMedicines', 'updateMedicine', 'deleteMedicine']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'pop']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      declarations: [EditMedicinePage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy },
        MedicinesService // Agrega el servicio real o un mock si es necesario
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMedicinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add controls on frecuencia change', () => {
    const event = { detail: { value: 2 } };
    component.onFrecuenciaChange(event);

    expect(component.horas.length).toBe(2);
    expect(component.medicamentoForm.contains('hora0Hora')).toBeTrue();
    expect(component.medicamentoForm.contains('hora0Minuto')).toBeTrue();
    expect(component.medicamentoForm.contains('hora1Hora')).toBeTrue();
    expect(component.medicamentoForm.contains('hora1Minuto')).toBeTrue();
  });

  it('should limit input length to 2 characters', () => {
    const event = { target: { value: '123' } };
    component.limitInputLength(event);

    expect(event.target.value).toBe('12');
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

  it('should delete medicine', fakeAsync(() => {
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));
    medicinesServiceSpy.deleteMedicine.and.returnValue(Promise.resolve());

    component.eliminar('mockId');
    tick(); // Procesa la promesa

    expect(alertCtrlSpy.create).toHaveBeenCalled(); // Verifica que se crea la alerta
    expect(alertSpy.present).toHaveBeenCalled(); // Verifica que se presenta la alerta
  }));

  it('should decrement count', () => {
    component.count = 2;
    component.decrement();
    expect(component.count).toBe(1);
  });

  it('should increment count', () => {
    component.count = 1;
    component.increment();
    expect(component.count).toBe(2);
  });

  it('should reset count to 1 if value is less than 1', () => {
    const event = { target: { value: 0 } };
    component.onCounterChange(event);
    expect(component.count).toBe(1);
  });

  it('should set count to value if value is greater than 1', () => {
    const event = { target: { value: 5 } };
    component.onCounterChange(event);
    expect(component.count).toBe(5);
  });

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(navCtrlSpy.pop).toHaveBeenCalled();
  });
});
