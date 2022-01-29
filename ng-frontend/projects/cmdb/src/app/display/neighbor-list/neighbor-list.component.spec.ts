import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborListComponent } from './neighbor-list.component';

describe('NeighborListComponent', () => {
  let component: NeighborListComponent;
  let fixture: ComponentFixture<NeighborListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
