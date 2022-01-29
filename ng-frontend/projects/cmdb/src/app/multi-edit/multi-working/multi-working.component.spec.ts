import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiWorkingComponent } from './multi-working.component';

describe('MultiWorkingComponent', () => {
  let component: MultiWorkingComponent;
  let fixture: ComponentFixture<MultiWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiWorkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
