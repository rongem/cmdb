import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAttributesComponent } from './multi-attributes.component';

describe('MultiAttributesComponent', () => {
  let component: MultiAttributesComponent;
  let fixture: ComponentFixture<MultiAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
