import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToItemTypeComponent } from './convert-to-item-type.component';

describe('ConvertToItemTypeComponent', () => {
  let component: ConvertToItemTypeComponent;
  let fixture: ComponentFixture<ConvertToItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertToItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertToItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
