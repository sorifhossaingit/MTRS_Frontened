import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistOrderDetailsComponent } from './stockist-order-details.component';

describe('StockistOrderDetailsComponent', () => {
  let component: StockistOrderDetailsComponent;
  let fixture: ComponentFixture<StockistOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockistOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockistOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
