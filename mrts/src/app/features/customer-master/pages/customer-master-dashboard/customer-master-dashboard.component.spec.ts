import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMasterDashboardComponent } from './customer-master-dashboard.component';

describe('CustomerMasterDashboardComponent', () => {
  let component: CustomerMasterDashboardComponent;
  let fixture: ComponentFixture<CustomerMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
