import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrVisitDashboardComponent } from './mr-visit-dashboard.component';

describe('MrVisitDashboardComponent', () => {
  let component: MrVisitDashboardComponent;
  let fixture: ComponentFixture<MrVisitDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MrVisitDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrVisitDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
