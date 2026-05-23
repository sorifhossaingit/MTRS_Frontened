import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAreaManagerComponent } from './add-area-manager.component';

describe('AddAreaManagerComponent', () => {
  let component: AddAreaManagerComponent;
  let fixture: ComponentFixture<AddAreaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAreaManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAreaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
