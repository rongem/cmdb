import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { GraphLine } from 'src/app/display/objects/graph-line.model';

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
      switchMap(item => this.store.select(fromSelectDisplay.selectGraphItem, item.id)),
    );
  }

  private getGraphLine(ci: FullConfigurationItem, conn: FullConnection): GraphLine {
    return {
      id: conn.id,
      origin: ci.id,
      target: conn.targetId,
      description: conn.description,
      topX: -1,
      topY: -1,
      bottonX: -1,
      bottomY: -1,
      originIndex: -1,
      targetIndex: -1,
    };
  }
}
