import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemResponsibilitiesComponent } from './edit-item-responsibilities.component';

describe('EditItemResponsibilitiesComponent', () => {
  let component: EditItemResponsibilitiesComponent;
  let fixture: ComponentFixture<EditItemResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemResponsibilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
