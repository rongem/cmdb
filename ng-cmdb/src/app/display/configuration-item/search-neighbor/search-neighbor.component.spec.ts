import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNeighborComponent } from './search-neighbor.component';

describe('SearchNeighborComponent', () => {
  let component: SearchNeighborComponent;
  let fixture: ComponentFixture<SearchNeighborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNeighborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNeighborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
