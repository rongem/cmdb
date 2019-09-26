import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { AddConnectionComponent } from './add-connection/add-connection.component';
import { Connection } from 'src/app/shared/objects/connection.model';

@Component({
  selector: 'app-edit-item-connections',
  templateUrl: './edit-item-connections.component.html',
  styleUrls: ['./edit-item-connections.component.scss']
})
export class EditItemConnectionsComponent implements OnInit {
  itemId: Guid;
  editConnection: FullConnection;
  connectionColumns = ['item', 'description', 'commands'];

  constructor(private store: Store<fromApp.AppState>, public dialog: MatDialog) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => this.itemId = item ? item.id : undefined),
    );
  }

  get connectionTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectAvailableConnectionTypeGroupsToLower));
  }

  getConnectionRules(typeId: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectAvailableConnectionRulesToLowerByType, typeId));
  }

  getConnectionRule(ruleId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionRule, ruleId));
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getItemTypeName(itemTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId), map(t => t.TypeName));
  }

  getItemTypeColor(itemTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleItemType, itemTypeId), map(t => t.TypeBackColor));
  }

  onDeleteConnection(connId: Guid) {
    this.store.dispatch(EditActions.deleteConnection({connId, itemId: this.itemId}));
  }

  onEditConnection(connection: FullConnection) {
    this.editConnection = connection;
  }

  onCancelEdit() {
    this.editConnection = undefined;
  }

  onAddConnection(rule: ConnectionRule) {
    const dialogRef = this.dialog.open(AddConnectionComponent, {
      width: 'auto',
      // class:
      data: { rule, itemId: this.itemId },
    });
    dialogRef.afterClosed().subscribe(connection => {
      if (connection instanceof Connection) {
        this.store.dispatch(EditActions.createConnection({connection, itemId: this.itemId}));
      }
    });
  }

}
