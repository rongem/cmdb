import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDeleteComponent } from './multi-delete.component';

describe('MultiDeleteComponent', () => {
  let component: MultiDeleteComponent;
  let fixture: ComponentFixture<MultiDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
