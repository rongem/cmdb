import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypesComponent } from './item-types.component';

describe('ItemTypesComponent', () => {
  let component: ItemTypesComponent;
  let fixture: ComponentFixture<ItemTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
