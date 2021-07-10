import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNameValueComponent } from './search-name-value.component';

describe('SearchNameValueComponent', () => {
  let component: SearchNameValueComponent;
  let fixture: ComponentFixture<SearchNameValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNameValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNameValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
