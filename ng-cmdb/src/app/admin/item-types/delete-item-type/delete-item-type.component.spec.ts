import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemTypeComponent } from './delete-item-type.component';

describe('DeleteItemTypeComponent', () => {
  let component: DeleteItemTypeComponent;
  let fixture: ComponentFixture<DeleteItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
