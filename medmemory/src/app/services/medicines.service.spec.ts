import { TestBed } from '@angular/core/testing';
import { MedicinesService } from './medicines.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { User } from 'firebase/auth';

describe('MedicinesService', () => {
  let service: MedicinesService;
  let firestoreMock: any;
  let afAuthMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jasmine.createSpy().and.returnValue({
        add: jasmine.createSpy().and.returnValue(Promise.resolve()),
        doc: jasmine.createSpy().and.returnValue({
          get: jasmine.createSpy().and.returnValue(Promise.resolve({ data: () => ({}) })),
          update: jasmine.createSpy().and.returnValue(Promise.resolve()),
          delete: jasmine.createSpy().and.returnValue(Promise.resolve()),
        }),
        snapshotChanges: jasmine.createSpy().and.returnValue(of([]))
      })
    };

    afAuthMock = {
      authState: of({ uid: 'mockUserId' } as User)
    };

    TestBed.configureTestingModule({
      providers: [
        MedicinesService,
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: AngularFireAuth, useValue: afAuthMock }
      ]
    });

    service = TestBed.inject(MedicinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a medicine', async () => {
    const medicineData = { name: 'Test Medicine' };
    await service.addMedicine(medicineData);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/medicines');
    expect(firestoreMock.collection().add).toHaveBeenCalledWith(medicineData);
  });

  it('should get medicines', (done) => {
    service.getMedicines().subscribe(medicines => {
      expect(medicines).toEqual([]);
      expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/medicines');
      done();
    });
  });

  it('should get medicine by id', async () => {
    const id = 'mockMedicineId';
    const medicine = await service.getById(id);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/medicines');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).get).toHaveBeenCalled();
  });

  it('should update a medicine', async () => {
    const id = 'mockMedicineId';
    const updateData = { name: 'Updated Medicine' };
    await service.updateMedicine(id, updateData);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/medicines');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).update).toHaveBeenCalledWith(updateData);
  });

  it('should delete a medicine', async () => {
    const id = 'mockMedicineId';
    await service.deleteMedicine(id);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/medicines');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).delete).toHaveBeenCalled();
  });
});