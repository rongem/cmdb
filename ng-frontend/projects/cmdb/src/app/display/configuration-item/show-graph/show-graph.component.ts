import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

@Component({
  selector: 'app-show-graph',
  templateUrl: './show-graph.component.html',
  styleUrls: ['./show-graph.component.scss']
})
export class ShowGraphComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) { }

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
      switchMap(item => this.store.select(fromSelectDisplay.selectGraphItem, item?.id)),
    );
  }
}
