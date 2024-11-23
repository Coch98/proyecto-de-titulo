import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  // Método para agregar una nueva cita
  addAppointment(appointmentData: any) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/appointments`).add(appointmentData);
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    ).toPromise();
  }

  // Método para obtener todas las citas del usuario actual
  getAppointments() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/appointments`).snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  // Método para obtener una cita por ID
  getAppointmentById(id: string) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/appointments`).doc(id).get();
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    ).toPromise();
  }

  // Método para actualizar una cita
  updateAppointment(id: string, data: any) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/appointments`).doc(id).update(data);
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    ).toPromise();
  }

  // Método para eliminar una cita
  deleteAppointment(id: string) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/appointments`).doc(id).delete();
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    ).toPromise();
  }
}