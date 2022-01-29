import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemConnectionsComponent } from './edit-item-connections.component';

describe('EditItemConnectionsComponent', () => {
  let component: EditItemConnectionsComponent;
  let fixture: ComponentFixture<EditItemConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
