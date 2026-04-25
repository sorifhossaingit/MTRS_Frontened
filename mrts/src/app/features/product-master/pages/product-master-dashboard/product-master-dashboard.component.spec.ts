import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMasterDashboardComponent } from './product-master-dashboard.component';

describe('ProductMasterDashboardComponent', () => {
  let component: ProductMasterDashboardComponent;
  let fixture: ComponentFixture<ProductMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
