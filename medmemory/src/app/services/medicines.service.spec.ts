import { TestBed } from '@angular/core/testing';
import { MedicinesService } from './medicines.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de que la ruta sea correcta
import { AngularFireModule } from '@angular/fire/compat'; // Importar AngularFireModule
import { environment } from '../../environments/environment';

describe('MedicinesService', () => {
  let service: MedicinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig) // Inicializar AngularFire con tu configuración
      ],
      providers: [AngularFirestore] // Proporcionar AngularFirestore
    });

    service = TestBed.inject(MedicinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
