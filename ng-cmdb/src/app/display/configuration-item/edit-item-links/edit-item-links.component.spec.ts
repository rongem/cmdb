import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemLinksComponent } from './edit-item-links.component';

describe('EditItemLinksComponent', () => {
  let component: EditItemLinksComponent;
  let fixture: ComponentFixture<EditItemLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
