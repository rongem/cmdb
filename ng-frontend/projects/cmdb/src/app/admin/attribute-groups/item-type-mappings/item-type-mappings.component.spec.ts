import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroupItemTypeMappingsComponent } from './item-type-mappings.component';

describe('ItemTypeAttributeGroupMappingsComponent', () => {
  let component: AttributeGroupItemTypeMappingsComponent;
  let fixture: ComponentFixture<AttributeGroupItemTypeMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeGroupItemTypeMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeGroupItemTypeMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
