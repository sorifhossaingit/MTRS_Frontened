import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistMasterDashboardComponent } from './stockist-master-dashboard.component';

describe('StockistMasterDashboardComponent', () => {
  let component: StockistMasterDashboardComponent;
  let fixture: ComponentFixture<StockistMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockistMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockistMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
