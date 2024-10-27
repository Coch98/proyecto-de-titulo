import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { LoginPage } from './login.page';
import { AuthService } from '../services/auth.service'; 
import { of, throwError } from 'rxjs'; // Asegúrate de importar throwError para simular errores
import { NavController } from '@ionic/angular'; // Asegúrate de importar NavController
import { AlertController } from '@ionic/angular'; // Importar AlertController
import { fakeAsync, tick } from '@angular/core/testing';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    // Crear Spies para los servicios
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginUser']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateBack']);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    // Simular el método present de Alert
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpy.create.and.returnValue(Promise.resolve(alertSpy));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on successful login', fakeAsync(() => {
    authServiceSpy.loginUser.and.returnValue(Promise.resolve());

    component.user = {
      email: 'test@example.com',
      password: 'password123'
    };

    component.onLogin();
    tick();

    expect(navCtrlSpy.navigateBack).toHaveBeenCalledWith('/home');
  }));

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
  
    component.togglePasswordVisibility();
  
    expect(component.passwordVisible).toBeTrue();
  
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should set errorMessage on login error', fakeAsync(() => {
    authServiceSpy.loginUser.and.returnValue(Promise.reject('Login error'));

    component.user = {
      email: 'test@example.com',
      password: 'password123'
    };

    component.onLogin();
    tick();

    expect(component.errorMessage).toBe('');
  })); 

  
});

  

