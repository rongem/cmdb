import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemAttributesComponent } from './edit-item-attributes.component';

describe('EditItemAttributesComponent', () => {
  let component: EditItemAttributesComponent;
  let fixture: ComponentFixture<EditItemAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
