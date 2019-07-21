import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionRulesComponent } from './connection-rules.component';

describe('ConnectionRulesComponent', () => {
  let component: ConnectionRulesComponent;
  let fixture: ComponentFixture<ConnectionRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
