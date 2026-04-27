import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineOrderMasterComponent } from './medicine-order-master.component';

describe('MedicineOrderMasterComponent', () => {
  let component: MedicineOrderMasterComponent;
  let fixture: ComponentFixture<MedicineOrderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicineOrderMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineOrderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
