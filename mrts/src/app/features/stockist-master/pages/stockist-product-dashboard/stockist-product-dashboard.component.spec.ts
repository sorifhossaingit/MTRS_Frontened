import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistProductDashboardComponent } from './stockist-product-dashboard.component';

describe('StockistProductDashboardComponent', () => {
  let component: StockistProductDashboardComponent;
  let fixture: ComponentFixture<StockistProductDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockistProductDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockistProductDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
