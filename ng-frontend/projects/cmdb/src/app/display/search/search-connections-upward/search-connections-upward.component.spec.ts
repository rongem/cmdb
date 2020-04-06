import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConnectionsUpwardComponent } from './search-connections-upward.component';

describe('SearchConnectionsUpwardComponent', () => {
  let component: SearchConnectionsUpwardComponent;
  let fixture: ComponentFixture<SearchConnectionsUpwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchConnectionsUpwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchConnectionsUpwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
