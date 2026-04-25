import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVisitDashboardComponent } from './master-visit-dashboard.component';

describe('MasterVisitDashboardComponent', () => {
  let component: MasterVisitDashboardComponent;
  let fixture: ComponentFixture<MasterVisitDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterVisitDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterVisitDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
