import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConnectionTypeComponent } from './delete-connection-type.component';

describe('DeleteConnectionTypeComponent', () => {
  let component: DeleteConnectionTypeComponent;
  let fixture: ComponentFixture<DeleteConnectionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConnectionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConnectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
