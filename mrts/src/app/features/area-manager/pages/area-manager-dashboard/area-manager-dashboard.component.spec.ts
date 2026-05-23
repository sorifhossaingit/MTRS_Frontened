import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaManagerDashboardComponent } from './area-manager-dashboard.component';

describe('AreaManagerDashboardComponent', () => {
  let component: AreaManagerDashboardComponent;
  let fixture: ComponentFixture<AreaManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreaManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
