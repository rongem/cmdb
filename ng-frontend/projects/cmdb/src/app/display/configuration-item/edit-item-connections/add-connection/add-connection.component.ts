import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Guid, ConnectionRule, Connection, ConfigurationItem, Functions, StoreConstants, ErrorActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class AddConnectionComponent implements OnInit {
  connection = new Connection();
  configurationItems: ConfigurationItem[] = [];
  loading = false;
  error = false;
  noResult = false;

  constructor(public dialogRef: MatDialogRef<AddConnectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule, itemId: string},
              public dialog: MatDialog,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.loading = true;
    this.connection.id = Guid.create().toString();
    this.connection.ruleId = this.data.rule.id;
    this.connection.typeId = this.data.rule.connectionTypeId;
    this.connection.upperItemId = this.data.itemId;
    this.connection.description = '';
    this.http.get<ConfigurationItem[]>(Functions.getUrl(StoreConstants.CONFIGURATIONITEM + this.data.itemId + StoreConstants.CONNECTABLE +
      this.data.rule.id)).pipe(take(1)).subscribe((configurationItems) => {
        this.configurationItems = configurationItems;
        this.loading = false;
        this.noResult = configurationItems.length === 0;
        this.error = false;
        if (!this.noResult) {
          this.connection.lowerItemId = configurationItems[0].id;
        }
      }, (error: HttpErrorResponse) => {
        this.configurationItems = [];
        this.loading = false;
        this.error = true;
        this.noResult = true;
        this.store.dispatch(ErrorActions.error({error, fatal: false}));
      });
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get connectionType() {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, this.data.rule.connectionTypeId);
  }

  get connectionRule() {
    return this.data.rule;
  }

  get targetItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType, this.data.rule.lowerItemTypeId);
  }

  onSave() {
    this.dialogRef.close(this.connection);
  }

}
