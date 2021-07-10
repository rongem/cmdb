import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemTypeComponent } from './search-item-type.component';

describe('SearchItemTypesComponent', () => {
  let component: SearchItemTypeComponent;
  let fixture: ComponentFixture<SearchItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
