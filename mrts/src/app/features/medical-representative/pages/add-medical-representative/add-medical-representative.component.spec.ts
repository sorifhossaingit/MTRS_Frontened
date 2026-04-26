import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalRepresentativeComponent } from './add-medical-representative.component';

describe('AddMedicalRepresentativeComponent', () => {
  let component: AddMedicalRepresentativeComponent;
  let fixture: ComponentFixture<AddMedicalRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMedicalRepresentativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
