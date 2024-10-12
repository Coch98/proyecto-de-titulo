import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { AngularFirestore } from '@angular/fire/compat/firestore';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;

  beforeEach(async () => {
    // Crear un Spy para el AuthService y AngularFirestore
    authServiceSpy = jasmine.createSpyObj('AuthService', ['someMethod']); // Reemplaza 'someMethod' con los métodos que necesites espiar
    firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']); // Espía los métodos que utilices

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
