import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicineFormPage } from './medicine-form.page';

describe('MedicineFormPage', () => {
  let component: MedicineFormPage;
  let fixture: ComponentFixture<MedicineFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
