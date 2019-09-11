import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemAttributesComponent } from './display-item-attributes.component';

describe('AttributesComponent', () => {
  let component: DisplayItemAttributesComponent;
  let fixture: ComponentFixture<DisplayItemAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayItemAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
