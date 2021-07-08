import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConnectionRule, Connection, ConfigurationItem, ErrorActions, MetaDataSelectors, ReadFunctions } from 'backend-access';

import * as fromSelectDisplay from '../../../store/display.selectors';

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
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule; itemId: string},
              public dialog: MatDialog,
              private http: HttpClient,
              private store: Store) { }

  ngOnInit() {
    this.loading = true;
    this.connection.ruleId = this.data.rule.id;
    this.connection.typeId = this.data.rule.connectionTypeId;
    this.connection.upperItemId = this.data.itemId;
    this.connection.description = '';
    ReadFunctions.connectableItemsForItem(this.http, this.data.itemId, this.data.rule.id).subscribe((configurationItems) => {
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
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(this.data.rule.connectionTypeId));
  }

  get connectionRule() {
    return this.data.rule;
  }

  get targetItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.data.rule.lowerItemTypeId));
  }

  get isDescriptionValid() {
    return new RegExp(this.connectionRule.validationExpression).test(this.connection.description);
  }

  onSave() {
    this.dialogRef.close(this.connection);
  }

}
