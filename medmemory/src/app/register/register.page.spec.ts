import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterPage } from './register.page';
import { AuthService } from '../services/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['registerUser']);

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the register page', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUser when onRegister is triggered', fakeAsync(() => {
    // Simular una promesa resuelta exitosa
    authServiceSpy.registerUser.and.returnValue(Promise.resolve());

    component.user = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
    };

    component.onRegister();  // Llamada al método
    tick(); // Avanzar el tiempo simulado

    expect(authServiceSpy.registerUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
    }); // Comprobar que el registro se llama con los datos correctos
}));

  it('should reset form after registration', fakeAsync(() => {
    component.user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    authServiceSpy.registerUser.and.returnValue(Promise.resolve());
    component.onRegister();
    tick(); // Avanzar el tiempo simulado

    expect(component.user.name).toBe('');
    expect(component.user.email).toBe('');
    expect(component.user.password).toBe('');
  }));

  it('should handle registration error', fakeAsync(() => {
    authServiceSpy.registerUser.and.returnValue(Promise.reject('Registration error'));

    component.user = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    component.onRegister();
    tick();

    expect(component.errorMessage).toBe('Formato de correo invalido');
  }));
  
});
