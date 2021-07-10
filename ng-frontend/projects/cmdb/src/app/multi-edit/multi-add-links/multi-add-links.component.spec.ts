import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAddLinksComponent } from './multi-add-links.component';

describe('MultiAddLinksComponent', () => {
  let component: MultiAddLinksComponent;
  let fixture: ComponentFixture<MultiAddLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAddLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAddLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
