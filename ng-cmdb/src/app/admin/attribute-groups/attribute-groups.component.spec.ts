import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroupsComponent } from './attribute-groups.component';

describe('AttributeGroupsComponent', () => {
  let component: AttributeGroupsComponent;
  let fixture: ComponentFixture<AttributeGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
