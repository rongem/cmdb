import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap, skipWhile, take, withLatestFrom, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { GraphItem } from 'src/app/display/objects/graph-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { GraphLine } from 'src/app/display/objects/graph-line.model';

@Component({
  selector: 'app-show-graph',
  templateUrl: './show-graph.component.html',
  styleUrls: ['./show-graph.component.scss']
})
export class ShowGraphComponent implements OnInit {
  itemsAbove: GraphItem[] = [];
  itemsBelow: GraphItem[] = [];

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.itemReady.pipe(
      skipWhile(ready => ready === false),
      take(1),
      switchMap(() => this.configurationItem),
      tap(ci => {
        ci.connectionsToUpper.forEach(conn => this.itemsAbove.push(this.getGraphItem(ci, conn)));
        ci.connectionsToLower.forEach(conn => this.itemsBelow.push(this.getGraphItem(ci, conn)));
        console.log(this.itemsBelow, this.itemsAbove);
      }),
    ).subscribe();
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
    );
  }

  private getGraphItem(ci: FullConfigurationItem, conn: FullConnection): GraphItem {
    return {
      id: conn.targetId,
      level: -1,
      name: conn.targetName,
      type: conn.targetType,
      connections: [this.getGraphLine(ci, conn)],
    };
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
