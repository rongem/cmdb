import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemTypesComponent } from './search-item-types.component';

describe('SearchItemTypesComponent', () => {
  let component: SearchItemTypesComponent;
  let fixture: ComponentFixture<SearchItemTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
