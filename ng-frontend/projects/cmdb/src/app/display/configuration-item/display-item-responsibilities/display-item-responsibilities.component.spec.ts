import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemResponsibilitiesComponent } from './display-item-responsibilities.component';

describe('DisplayItemResponsibilitiesComponent', () => {
  let component: DisplayItemResponsibilitiesComponent;
  let fixture: ComponentFixture<DisplayItemResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayItemResponsibilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
