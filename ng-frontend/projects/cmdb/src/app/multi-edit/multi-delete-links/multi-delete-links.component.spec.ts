import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDeleteLinksComponent } from './multi-delete-links.component';

describe('MultiDeleteLinksComponent', () => {
  let component: MultiDeleteLinksComponent;
  let fixture: ComponentFixture<MultiDeleteLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDeleteLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDeleteLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
