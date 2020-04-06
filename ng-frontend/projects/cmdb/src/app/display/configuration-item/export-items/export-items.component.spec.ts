import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportItemsComponent } from './export-items.component';

describe('ExportItemsComponent', () => {
  let component: ExportItemsComponent;
  let fixture: ComponentFixture<ExportItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
