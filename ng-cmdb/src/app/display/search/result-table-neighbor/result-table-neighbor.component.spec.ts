import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultTableNeighborComponent } from './result-table-neighbor.component';

describe('ResultListNeighborComponent', () => {
  let component: ResultTableNeighborComponent;
  let fixture: ComponentFixture<ResultTableNeighborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultTableNeighborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTableNeighborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
