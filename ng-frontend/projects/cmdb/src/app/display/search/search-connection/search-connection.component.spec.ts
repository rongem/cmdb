import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConnectionComponent } from './search-connection.component';

describe('SearchConnectionComponent', () => {
  let component: SearchConnectionComponent;
  let fixture: ComponentFixture<SearchConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
