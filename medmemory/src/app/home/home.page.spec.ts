import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MedicinesService } from '../services/medicines.service';
import { of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { fakeAsync, tick } from '@angular/core/testing';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let medicinesServiceSpy: jasmine.SpyObj<MedicinesService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    // Crear Spies para los servicios
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logoutUser']);
    firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);
    medicinesServiceSpy = jasmine.createSpyObj('MedicinesService', ['getMedicines', 'deleteMedicine']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AngularFirestore, useValue: firestoreSpy },
        { provide: MedicinesService, useValue: medicinesServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate back to login on logout', async () => {
    authServiceSpy.logoutUser.and.returnValue(Promise.resolve());

    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    await component.onLogout();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    
    alertSpy.present.and.callFake(() => {
      expect(authServiceSpy.logoutUser).toHaveBeenCalled();
      expect(navCtrlSpy.navigateBack).toHaveBeenCalledWith('/login');
    });
  });

  it('should navigate to medicine form', () => {
    component.goToMedicineForm();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/medicine-form');
  });

  it('should edit medicine and navigate to edit page', fakeAsync(() => {
    const mockMedicineId = '1';
    component.editar(mockMedicineId);
    
    // Simula el paso del tiempo
    tick(150); // Espera 150ms para que se ejecute el setTimeout
    
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith(`/edit-medicine/${mockMedicineId}`);
  }));
});
