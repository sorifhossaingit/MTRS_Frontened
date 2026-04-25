import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockistComponent } from './add-stockist.component';

describe('AddStockistComponent', () => {
  let component: AddStockistComponent;
  let fixture: ComponentFixture<AddStockistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStockistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
