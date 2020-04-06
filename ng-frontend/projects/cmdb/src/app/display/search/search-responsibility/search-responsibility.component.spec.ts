import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResponsibilityComponent } from './search-responsibility.component';

describe('SearchResponsibilityComponent', () => {
  let component: SearchResponsibilityComponent;
  let fixture: ComponentFixture<SearchResponsibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResponsibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
