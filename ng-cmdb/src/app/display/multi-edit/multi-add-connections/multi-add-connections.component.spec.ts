import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAddConnectionsComponent } from './multi-add-connections.component';

describe('MultiAddConnectionsComponent', () => {
  let component: MultiAddConnectionsComponent;
  let fixture: ComponentFixture<MultiAddConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAddConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAddConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
