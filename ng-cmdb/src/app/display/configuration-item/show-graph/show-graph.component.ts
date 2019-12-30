import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

@Component({
  selector: 'app-show-graph',
  templateUrl: './show-graph.component.html',
  styleUrls: ['./show-graph.component.scss']
})
export class ShowGraphComponent implements OnInit {
  private item: FullConfigurationItem;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap(ci => this.item = ci),
    );
  }

}
