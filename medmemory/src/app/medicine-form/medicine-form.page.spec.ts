import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicineFormPage } from './medicine-form.page';
import { MedicinesService } from '../services/medicines.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('MedicineFormPage', () => {
  let component: MedicineFormPage;
  let fixture: ComponentFixture<MedicineFormPage>;
  let medicinesServiceSpy: jasmine.SpyObj<MedicinesService>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    medicinesServiceSpy = jasmine.createSpyObj('MedicinesService', ['getMedicines','addMedicine']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['pop']);
    
    await TestBed.configureTestingModule({
      declarations: [MedicineFormPage],
      providers: [
        { provide: MedicinesService, useValue: medicinesServiceSpy },
        { provide: AngularFirestore, useValue: jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']) },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update hours controls when frequency changes', () => {
    const event = { detail: { value: 3 } };
    component.onFrecuenciaChange(event);
    expect(Object.keys(component.medicamentoForm.controls)).toContain('hora0Hora');
    expect(Object.keys(component.medicamentoForm.controls)).toContain('hora1Hora');
    expect(Object.keys(component.medicamentoForm.controls)).toContain('hora2Hora');
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
