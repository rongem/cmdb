import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeAttributeGroupMappingsComponent } from './attribute-group-mappings.component';

describe('ItemTypeAttributeGroupMappingsComponent', () => {
  let component: ItemTypeAttributeGroupMappingsComponent;
  let fixture: ComponentFixture<ItemTypeAttributeGroupMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeAttributeGroupMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeAttributeGroupMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
