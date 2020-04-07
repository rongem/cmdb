import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Guid, FullConfigurationItem, FullConnection, ConnectionRule, Connection } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';
import * as EditActions from 'projects/cmdb/src/app/display/store/edit.actions';

import { AddConnectionComponent } from './add-connection/add-connection.component';

@Component({
  selector: 'app-edit-item-connections',
  templateUrl: './edit-item-connections.component.html',
  styleUrls: ['./edit-item-connections.component.scss']
})
export class EditItemConnectionsComponent implements OnInit {
  itemId: Guid;
  editConnection: FullConnection;

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
    return this.store.select(fromSelectDisplay.selectAvailableConnectionTypeGroupsToLower);
  }

  getConnectionRules(typeId: Guid) {
    return this.store.select(fromSelectDisplay.selectAvailableConnectionRulesToLowerByType, typeId);
  }

  getConnectionRule(ruleId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionRule, ruleId);
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getItemTypeName(itemTypeId: Guid) {
    return this.store.pipe(
      select(fromSelectMetaData.selectSingleItemType, itemTypeId),
      map(t => t.TypeName)
    );
  }

  getItemTypeColor(itemTypeId: Guid) {
    return this.store.pipe(
      select(fromSelectMetaData.selectSingleItemType, itemTypeId),
      map(t => t.TypeBackColor)
    );
  }

  onDeleteConnection(connId: Guid) {
    this.store.dispatch(EditActions.deleteConnection({connId, itemId: this.itemId}));
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

  onUpdateConnection(conn: FullConnection, newText: string) {
    const connection: Connection = {
      ConnId: conn.id,
      ConnUpperItem: this.itemId,
      ConnLowerItem: conn.targetId,
      ConnType: conn.typeId,
      RuleId: conn.ruleId,
      Description: newText,
    };
    this.store.dispatch(EditActions.updateConnection({connection, itemId: this.itemId}));
  }
}
