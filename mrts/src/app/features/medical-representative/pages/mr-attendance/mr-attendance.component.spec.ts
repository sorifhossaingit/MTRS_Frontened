import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrAttendanceComponent } from './mr-attendance.component';

describe('MrAttendanceComponent', () => {
  let component: MrAttendanceComponent;
  let fixture: ComponentFixture<MrAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MrAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
