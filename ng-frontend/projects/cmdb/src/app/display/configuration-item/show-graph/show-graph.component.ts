import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { ItemSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-show-graph',
  templateUrl: './show-graph.component.html',
  styleUrls: ['./show-graph.component.scss']
})
export class ShowGraphComponent implements OnInit {
  constructor(private store: Store) { }

  ngOnInit() {}

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get item() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      switchMap(item => this.store.select(ItemSelectors.graphItem(item?.id))),
    );
  }
}
