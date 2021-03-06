import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Guid, FullConfigurationItem, FullConnection, ConnectionRule, Connection, EditActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

import { AddConnectionComponent } from './add-connection/add-connection.component';

@Component({
  selector: 'app-edit-item-connections',
  templateUrl: './edit-item-connections.component.html',
  styleUrls: ['./edit-item-connections.component.scss']
})
export class EditItemConnectionsComponent implements OnInit {
  itemId: string;
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

  getConnectionRules(typeId: string) {
    return this.store.select(fromSelectDisplay.selectAvailableConnectionRulesToLowerByType, typeId);
  }

  getConnectionRule(ruleId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionRule, ruleId);
  }

  getConnectionsByRule(ruleId: string, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getItemTypeName(itemTypeId: string) {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemType, itemTypeId),
      map(t => t.name)
    );
  }

  getItemTypeColor(itemTypeId: string) {
    return this.store.pipe(
      select(MetaDataSelectors.selectSingleItemType, itemTypeId),
      map(t => t.backColor)
    );
  }

  onDeleteConnection(connId: string) {
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
      id: conn.id,
      upperItemId: this.itemId,
      lowerItemId: conn.targetId,
      typeId: conn.typeId,
      ruleId: conn.ruleId,
      description: newText,
    };
    this.store.dispatch(EditActions.updateConnection({connection, itemId: this.itemId}));
  }
}
