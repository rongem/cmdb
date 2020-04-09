import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { FullConfigurationItem, EditActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';


@Component({
  selector: 'app-edit-item-responsibilities',
  templateUrl: './edit-item-responsibilities.component.html',
  styleUrls: ['./edit-item-responsibilities.component.scss']
})
export class EditItemResponsibilitiesComponent implements OnInit {
  private item: FullConfigurationItem;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => this.item = item),
    );
  }

  get userName() {
    return this.store.select(fromSelectMetaData.selectUserName);
  }

  get userRole() {
    return this.store.select(fromSelectMetaData.selectUserRole);
  }

  onAbandonResponsibility() {
    this.store.dispatch(EditActions.abandonResponsibility({itemId: this.item.id}));
  }

  onDeleteResponsibility(userToken: string) {
    this.store.dispatch(EditActions.deleteInvalidResponsibility({itemId: this.item.id, userToken}));
  }

}
