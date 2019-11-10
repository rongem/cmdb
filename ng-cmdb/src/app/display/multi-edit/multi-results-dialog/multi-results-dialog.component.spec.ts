import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiResultsDialogComponent } from './multi-results-dialog.component';

describe('MultiResultsDialogComponent', () => {
  let component: MultiResultsDialogComponent;
  let fixture: ComponentFixture<MultiResultsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiResultsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
