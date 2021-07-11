import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { MultiEditActions } from 'backend-access';

import { MultiEditSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  @Input() itemId: string;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  get isIdSelected() {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids.includes(this.itemId))
    );
  }

  onChange(checked: boolean, itemId: string) {
    if (checked === true) {
      this.store.dispatch(MultiEditActions.addItemId({itemId}));
    } else {
      this.store.dispatch(MultiEditActions.removeItemId({itemId}));
    }
  }

}
