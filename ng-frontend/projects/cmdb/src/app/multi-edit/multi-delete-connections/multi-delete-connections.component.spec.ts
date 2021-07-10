import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDeleteConnectionsComponent } from './multi-delete-connections.component';

describe('MultiDeleteConnectionsComponent', () => {
  let component: MultiDeleteConnectionsComponent;
  let fixture: ComponentFixture<MultiDeleteConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDeleteConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDeleteConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
