import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {

  constructor(private firestore: AngularFirestore) {}

  addMedicine(medicineData: any) {
    return this.firestore.collection('medicines').add(medicineData);
  }

  getMedicines() {
    return this.firestore.collection('medicines').snapshotChanges();
  }
  
  updateMedicine(id: string, data: any) {
    return this.firestore.collection('medicines').doc(id).update(data);
  }

  deleteMedicine(id: string) {
    return this.firestore.collection('medicines').doc(id).delete();
  }
}
