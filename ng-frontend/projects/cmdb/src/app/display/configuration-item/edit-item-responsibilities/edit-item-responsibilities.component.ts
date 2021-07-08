import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { FullConfigurationItem, EditActions, MetaDataSelectors } from 'backend-access';

import * as fromSelectDisplay from '../../store/display.selectors';


@Component({
  selector: 'app-edit-item-responsibilities',
  templateUrl: './edit-item-responsibilities.component.html',
  styleUrls: ['./edit-item-responsibilities.component.scss']
})
export class EditItemResponsibilitiesComponent implements OnInit {
  private item: FullConfigurationItem;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem).pipe(
      tap((item: FullConfigurationItem) => this.item = item),
    );
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  onAbandonResponsibility() {
    this.store.dispatch(EditActions.abandonResponsibility({itemId: this.item.id}));
  }

}
