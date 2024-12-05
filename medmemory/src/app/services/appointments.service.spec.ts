import { TestBed } from '@angular/core/testing';
import { AppointmentsService } from './appointments.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { User } from 'firebase/auth';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
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
        AppointmentsService,
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: AngularFireAuth, useValue: afAuthMock }
      ]
    });

    service = TestBed.inject(AppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an appointment', async () => {
    const appointmentData = { title: 'Test Appointment' };
    await service.addAppointment(appointmentData);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/appointments');
    expect(firestoreMock.collection().add).toHaveBeenCalledWith(appointmentData);
  });

  it('should get appointments', (done) => {
    service.getAppointments().subscribe(appointments => {
      expect(appointments).toEqual([]);
      expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/appointments');
      done();
    });
  });

  it('should get appointment by id', async () => {
    const id = 'mockAppointmentId';
    const appointment = await service.getAppointmentById(id);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/appointments');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).get).toHaveBeenCalled();
  });

  it('should update an appointment', async () => {
    const id = 'mockAppointmentId';
    const updateData = { title: 'Updated Appointment' };
    await service.updateAppointment(id, updateData);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/appointments');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).update).toHaveBeenCalledWith(updateData);
  });

  it('should delete an appointment', async () => {
    const id = 'mockAppointmentId';
    await service.deleteAppointment(id);
    expect(firestoreMock.collection).toHaveBeenCalledWith('users/mockUserId/appointments');
    expect(firestoreMock.collection().doc).toHaveBeenCalledWith(id);
    expect(firestoreMock.collection().doc(id).delete).toHaveBeenCalled();
  });
});