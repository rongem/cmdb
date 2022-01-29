import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGraphComponent } from './show-graph.component';

describe('ShowGraphComponent', () => {
  let component: ShowGraphComponent;
  let fixture: ComponentFixture<ShowGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
