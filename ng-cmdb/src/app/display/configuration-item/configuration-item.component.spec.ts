import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationItemComponent } from './configuration-item.component';

describe('ConfigurationItemComponent', () => {
  let component: ConfigurationItemComponent;
  let fixture: ComponentFixture<ConfigurationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
