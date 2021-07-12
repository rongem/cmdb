import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitiesComponent } from './responsibilities.component';

describe('DisplayItemResponsibilitiesComponent', () => {
  let component: ResponsibilitiesComponent;
  let fixture: ComponentFixture<ResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsibilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
