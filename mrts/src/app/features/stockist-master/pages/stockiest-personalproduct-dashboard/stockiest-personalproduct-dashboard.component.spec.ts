import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockiestPersonalproductDashboardComponent } from './stockiest-personalproduct-dashboard.component';

describe('StockiestPersonalproductDashboardComponent', () => {
  let component: StockiestPersonalproductDashboardComponent;
  let fixture: ComponentFixture<StockiestPersonalproductDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockiestPersonalproductDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockiestPersonalproductDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
