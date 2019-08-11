import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDisplayComponent } from './role-display.component';

describe('RoleDisplayComponent', () => {
  let component: RoleDisplayComponent;
  let fixture: ComponentFixture<RoleDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
