import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromSelectDisplay from '../../store/display.selectors';

@Component({
  selector: 'app-show-graph',
  templateUrl: './show-graph.component.html',
  styleUrls: ['./show-graph.component.scss']
})
export class ShowGraphComponent implements OnInit {
  constructor(private store: Store) { }

  ngOnInit() {}

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get item() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      switchMap(item => this.store.select(fromSelectDisplay.selectGraphItem(item?.id))),
    );
  }
}
