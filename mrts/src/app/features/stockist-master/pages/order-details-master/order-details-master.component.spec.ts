import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsMasterComponent } from './order-details-master.component';

describe('OrderDetailsMasterComponent', () => {
  let component: OrderDetailsMasterComponent;
  let fixture: ComponentFixture<OrderDetailsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDetailsMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
