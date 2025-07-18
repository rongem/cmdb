import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { MultiEditActions, MultiEditSelectors } from '../../shared/store/store.api';

@Component({
    selector: 'app-item-selector',
    templateUrl: './item-selector.component.html',
    styleUrls: ['./item-selector.component.scss'],
    standalone: false
})
export class ItemSelectorComponent implements OnInit {
  @Input({required: true}) itemId: string;

  constructor(private store: Store) { }

  get isIdSelected() {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids.includes(this.itemId))
    );
  }

  ngOnInit() {
  }

  onChange(target: any, itemId: string) {
    const checked = (target as HTMLInputElement).checked;
    if (checked === true) {
      this.store.dispatch(MultiEditActions.addItemId({itemId}));
    } else {
      this.store.dispatch(MultiEditActions.removeItemId({itemId}));
    }
  }

}
