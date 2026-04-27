import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrOrderMasterComponent } from './mr-order-master.component';

describe('MrOrderMasterComponent', () => {
  let component: MrOrderMasterComponent;
  let fixture: ComponentFixture<MrOrderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MrOrderMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrOrderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
