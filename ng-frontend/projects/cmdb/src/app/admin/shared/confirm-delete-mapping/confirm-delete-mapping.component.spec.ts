import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteMappingComponent } from './confirm-delete-mapping.component';

describe('ConfirmDeleteMappingComponent', () => {
  let component: ConfirmDeleteMappingComponent;
  let fixture: ComponentFixture<ConfirmDeleteMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
