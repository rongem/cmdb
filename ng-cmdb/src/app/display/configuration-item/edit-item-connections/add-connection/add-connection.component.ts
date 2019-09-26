import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { Guid } from 'src/app/shared/guid';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class AddConnectionComponent implements OnInit {
  connection = new Connection();

  constructor(public dialogRef: MatDialogRef<AddConnectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule, itemId: Guid},
              public dialog: MatDialog,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem));
  }

  get connectionType() {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, this.data.rule.ConnType));
  }

  get itemType() {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, this.data.rule.ItemLowerType));
  }

  onSave() {
    this.dialogRef.close(this.connection);
  }

}
