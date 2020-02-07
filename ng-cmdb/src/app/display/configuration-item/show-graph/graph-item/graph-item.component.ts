import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

import { GraphItem } from 'src/app/display/objects/graph-item.model';

@Component({
  selector: 'app-graph-item',
  templateUrl: './graph-item.component.html',
  styleUrls: ['./graph-item.component.scss'],
  animations: [
    trigger('turnIn', [
      transition('void => *', [
        style({
          transform: 'rotateY(90deg)',
        }),
        animate(200, style({
          transform: 'rotateY(40deg)',
        })),
        animate(300),
      ])])
  ],
})
export class GraphItemComponent implements OnInit {
  @Input() item: GraphItem;
  @Input() expand = true;

  constructor(private store: Store<fromApp.AppState>) { }

  get itemsAbove() {
    return this.store.select(fromSelectDisplay.selectGraphItems, this.item.itemIdsAbove);
  }

  get itemsBelow() {
    return this.store.select(fromSelectDisplay.selectGraphItems, this.item.itemIdsBelow);
  }

  ngOnInit() {
    if (this.item.level < 0) {
      this.store.pipe(
        select(fromSelectDisplay.selectProcessedItemIds),
        take(1),
      ).subscribe(processedIds => {
        this.item.itemIdsAbove.forEach(id => {
          if (!processedIds.includes(id)) {
            this.store.dispatch(DisplayActions.readGraphItem({ id, level: this.item.level - 1}));
          }
        });
      });
    }
    if (this.item.level > 0) {
      this.store.pipe(
        select(fromSelectDisplay.selectProcessedItemIds),
        take(1),
      ).subscribe(processedIds => {
        this.item.itemIdsBelow.forEach(id => {
          if (!processedIds.includes(id)) {
            this.store.dispatch(DisplayActions.readGraphItem({ id, level: this.item.level + 1}));
          }
        });
      });
    }
  }

  expandClick() {
    this.expand = true;
  }

}
