import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrDashboardComponent } from './mr-dashboard.component';

describe('MrDashboardComponent', () => {
  let component: MrDashboardComponent;
  let fixture: ComponentFixture<MrDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MrDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
