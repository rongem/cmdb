import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingComponent } from './working.component';

describe('WorkingComponent', () => {
  let component: WorkingComponent;
  let fixture: ComponentFixture<WorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
