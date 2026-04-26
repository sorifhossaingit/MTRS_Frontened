import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRepresentativeMasterDashboardComponent } from './medical-representative-master-dashboard.component';

describe('MedicalRepresentativeMasterDashboardComponent', () => {
  let component: MedicalRepresentativeMasterDashboardComponent;
  let fixture: ComponentFixture<MedicalRepresentativeMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalRepresentativeMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRepresentativeMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
