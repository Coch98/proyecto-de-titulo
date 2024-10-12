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
    // Simular una promesa resuelta exitosa
    authServiceSpy.loginUser.and.returnValue(Promise.resolve());

    // Simular los datos del usuario
    component.user = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Llamar al método de inicio de sesión
    component.onLogin();
    tick(); // Avanzar el tiempo simulado

    // Verificar que se navega a la ruta '/home'
    expect(navCtrlSpy.navigateBack).toHaveBeenCalledWith('/home');
  }));

  it('should toggle password visibility', () => {
    // La contraseña no debe ser visible por defecto
    expect(component.passwordVisible).toBeFalse();
  
    // Llamar al método para cambiar la visibilidad
    component.togglePasswordVisibility();
  
    // Verificar que la visibilidad ha cambiado a true
    expect(component.passwordVisible).toBeTrue();
  
    // Llamar de nuevo para cambiar la visibilidad a false
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });
});

  

