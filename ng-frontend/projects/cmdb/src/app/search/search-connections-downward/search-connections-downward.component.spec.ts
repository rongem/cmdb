import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConnectionsDownwardComponent } from './search-connections-downward.component';

describe('SearchConnectionsDownwardComponent', () => {
  let component: SearchConnectionsDownwardComponent;
  let fixture: ComponentFixture<SearchConnectionsDownwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchConnectionsDownwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchConnectionsDownwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
