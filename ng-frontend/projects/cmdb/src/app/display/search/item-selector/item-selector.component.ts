import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { MultiEditActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMultiEdit from 'projects/cmdb/src/app/display/store/multi-edit.selectors';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  @Input() itemId: string;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get isIdSelected() {
    return this.store.pipe(
      select(fromSelectMultiEdit.selectIds),
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
