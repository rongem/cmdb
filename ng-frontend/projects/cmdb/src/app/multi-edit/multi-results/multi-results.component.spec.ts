import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiResultsComponent } from './multi-results.component';

describe('MultiResultsDialogComponent', () => {
  let component: MultiResultsComponent;
  let fixture: ComponentFixture<MultiResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
