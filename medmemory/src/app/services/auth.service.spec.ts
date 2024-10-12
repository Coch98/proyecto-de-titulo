import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de que la ruta sea correcta
import { AngularFireModule } from '@angular/fire/compat'; // Importar AngularFireModule
import { environment } from '../../environments/environment'; // Asegúrate de tener la configuración correcta

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig) // Inicializar AngularFire con tu configuración
      ],
      providers: [AngularFirestore] // Proporcionar AngularFirestore
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
