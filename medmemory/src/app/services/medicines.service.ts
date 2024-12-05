import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  // Método para agregar un nuevo medicamento
  addMedicine(medicineData: any) {
    return firstValueFrom(
      this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.firestore.collection(`users/${user.uid}/medicines`).add(medicineData);
          } else {
            throw new Error('Usuario no autenticado');
          }
        })
      )
    );
  }

  // Método para obtener todos los medicamentos del usuario actual
  getMedicines() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(`users/${user.uid}/medicines`).snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  // Método para obtener un medicamento por ID
  getById(id: string) {
    return firstValueFrom(
      this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.firestore.collection(`users/${user.uid}/medicines`).doc(id).get();
          } else {
            throw new Error('Usuario no autenticado');
          }
        })
      )
    );
  }

  // Método para actualizar un medicamento
  updateMedicine(id: string, data: any) {
    return firstValueFrom(
      this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.firestore.collection(`users/${user.uid}/medicines`).doc(id).update(data);
          } else {
            throw new Error('Usuario no autenticado');
          }
        })
      )
    );
  }

  // Método para eliminar un medicamento
  deleteMedicine(id: string) {
    return firstValueFrom(
      this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.firestore.collection(`users/${user.uid}/medicines`).doc(id).delete();
          } else {
            throw new Error('Usuario no autenticado');
          }
        })
      )
    );
  }
}