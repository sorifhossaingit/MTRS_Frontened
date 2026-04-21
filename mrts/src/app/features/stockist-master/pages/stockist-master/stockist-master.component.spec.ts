import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistMasterComponent } from './stockist-master.component';

describe('StockistMasterComponent', () => {
  let component: StockistMasterComponent;
  let fixture: ComponentFixture<StockistMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockistMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockistMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
