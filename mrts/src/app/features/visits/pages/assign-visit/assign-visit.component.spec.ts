import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVisitComponent } from './assign-visit.component';

describe('AssignVisitComponent', () => {
  let component: AssignVisitComponent;
  let fixture: ComponentFixture<AssignVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
