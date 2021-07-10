import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { DisplaySelectors } from '../../../shared/store/store.api';

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
      select(DisplaySelectors.getItemState),
      map(value => value.itemReady),
    );
  }

  get item() {
    return this.store.pipe(
      select(DisplaySelectors.selectDisplayConfigurationItem),
      switchMap(item => this.store.select(DisplaySelectors.selectGraphItem(item?.id))),
    );
  }
}
