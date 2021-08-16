import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTemplateComponent } from './menu-template.component';

describe('SidebarTemplateComponent', () => {
  let component: MenuTemplateComponent;
  let fixture: ComponentFixture<MenuTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
