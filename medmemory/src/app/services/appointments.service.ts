import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private firestore: AngularFirestore) {}

  // Método para agregar una nueva cita
  addAppointment(appointmentData: any) {
    return this.firestore.collection('appointments').add(appointmentData);
  }

  // Método para obtener todas las citas
  getAppointments() {
    return this.firestore.collection('appointments').snapshotChanges();
  }

  // Método para obtener una cita por ID
  getAppointmentById(id: string) {
    return this.firestore.collection('appointments').doc(id).get();
  }

  // Método para actualizar una cita
  updateAppointment(id: string, data: any) {
    return this.firestore.collection('appointments').doc(id).update(data);
  }

  // Método para eliminar una cita
  deleteAppointment(id: string) {
    return this.firestore.collection('appointments').doc(id).delete();
  }
}
