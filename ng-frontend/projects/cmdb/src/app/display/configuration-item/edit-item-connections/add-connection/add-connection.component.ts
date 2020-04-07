import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Guid, ConnectionRule, Connection, ConfigurationItem } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';
import * as MetaDataActions from 'projects/cmdb/src/app/shared/store/meta-data.actions';

import { getUrl } from 'projects/cmdb/src/app/shared/store/functions';

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
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule, itemId: Guid},
              public dialog: MatDialog,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.loading = true;
    this.connection.ConnId = Guid.create();
    this.connection.RuleId = this.data.rule.RuleId;
    this.connection.ConnType = this.data.rule.ConnType;
    this.connection.ConnUpperItem = this.data.itemId;
    this.connection.Description = '';
    this.http.get<ConfigurationItem[]>(getUrl('ConfigurationItem/' + this.data.itemId + '/Connectable/' +
      this.data.rule.RuleId)).pipe(take(1)).subscribe((configurationItems) => {
        this.configurationItems = configurationItems;
        this.loading = false;
        this.noResult = configurationItems.length === 0;
        this.error = false;
        if (!this.noResult) {
          this.connection.ConnLowerItem = configurationItems[0].ItemId;
        }
      }, (error: HttpErrorResponse) => {
        this.configurationItems = [];
        this.loading = false;
        this.error = true;
        this.noResult = true;
        this.store.dispatch(MetaDataActions.error({error, invalidateData: false}));
      });
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get connectionType() {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, this.data.rule.ConnType);
  }

  get connectionRule() {
    return this.data.rule;
  }

  get targetItemType() {
    return this.store.select(fromSelectMetaData.selectSingleItemType, this.data.rule.ItemLowerType);
  }

  onSave() {
    this.dialogRef.close(this.connection);
  }

}
