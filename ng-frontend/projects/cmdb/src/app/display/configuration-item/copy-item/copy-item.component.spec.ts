import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyItemComponent } from './copy-item.component';

describe('CopyItemComponent', () => {
  let component: CopyItemComponent;
  let fixture: ComponentFixture<CopyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
