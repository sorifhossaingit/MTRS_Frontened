import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminUserControlComponent } from './super-admin-user-control.component';

describe('SuperAdminUserControlComponent', () => {
  let component: SuperAdminUserControlComponent;
  let fixture: ComponentFixture<SuperAdminUserControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperAdminUserControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminUserControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
