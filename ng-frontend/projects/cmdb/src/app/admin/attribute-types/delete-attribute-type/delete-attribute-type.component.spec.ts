import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAttributeTypeComponent } from './delete-attribute-type.component';

describe('DeleteAttributeTypeComponent', () => {
  let component: DeleteAttributeTypeComponent;
  let fixture: ComponentFixture<DeleteAttributeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAttributeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAttributeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
