import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { FullConfigurationItem, FullConnection, ConnectionRule, Connection, EditActions, MetaDataSelectors } from 'backend-access';
import { ItemSelectors } from '../../shared/store/store.api';
import { AddConnectionComponent } from '../add-connection/add-connection.component';

@Component({
  selector: 'app-edit-item-connections',
  templateUrl: './edit-item-connections.component.html',
  styleUrls: ['./edit-item-connections.component.scss']
})
export class EditItemConnectionsComponent implements OnInit {
  itemId: string;
  editConnection: FullConnection;
  addRule: ConnectionRule;

  constructor(private store: Store) { }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      tap((item: FullConfigurationItem) => this.itemId = item ? item.id : undefined),
    );
  }

  get connectionTypes() {
    return this.store.select(ItemSelectors.availableConnectionTypeGroupsToLower);
  }

  ngOnInit() {
  }

  getConnectionRules(typeId: string) {
    return this.store.select(ItemSelectors.availableConnectionRulesToLowerByType(typeId));
  }

  getConnectionRule(ruleId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionRule(ruleId));
  }

  getConnectionsByRule(ruleId: string, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getItemTypeName(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId)).pipe(
      map(t => t.name)
    );
  }

  getItemTypeColor(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId)).pipe(
      map(t => t.backColor)
    );
  }

  onDeleteConnection(connId: string) {
    this.store.dispatch(EditActions.deleteConnection({connId}));
  }

  onCancelEdit() {
    this.editConnection = undefined;
  }

  onAddConnection(rule: ConnectionRule) {
    this.addRule = rule;
  }

  onCreateNewConnection(connection: Connection) {
    if (connection)
    {
      this.store.dispatch(EditActions.createConnection({connection}));
    }
    this.addRule = undefined;
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
    this.store.dispatch(EditActions.updateConnection({connection}));
    this.editConnection = undefined;
  }
}
