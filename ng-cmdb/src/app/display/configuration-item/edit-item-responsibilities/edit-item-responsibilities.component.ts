import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

@Component({
  selector: 'app-edit-item-responsibilities',
  templateUrl: './edit-item-responsibilities.component.html',
  styleUrls: ['./edit-item-responsibilities.component.scss']
})
export class EditItemResponsibilitiesComponent implements OnInit {
  itemId: Guid;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => this.itemId = item.id),
    );
  }

  get userName() {
    return this.store.pipe(select(fromSelectMetaData.selectUserName));
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }

  onAbandonResponsibility() {
    this.store.dispatch(EditActions.abandonResponsibility({itemId: this.itemId}));
  }

  onDeleteResponsibility(userToken: string) {
    this.store.dispatch(EditActions.deleteInvalidResponsibility({itemId: this.itemId, userToken}));
  }

}
