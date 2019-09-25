import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';

@Component({
  selector: 'app-edit-item-connections',
  templateUrl: './edit-item-connections.component.html',
  styleUrls: ['./edit-item-connections.component.scss']
})
export class EditItemConnectionsComponent implements OnInit {
  itemId: Guid;
  editConnection: FullConnection;
  connectionColumns = ['item', 'description', 'commands'];

  constructor(private store: Store<fromApp.AppState>) { }

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
    return this.store.pipe(select(fromSelectDisplay.selectAvailableConnectionRuleIdsToLowerByType, typeId));
  }

  getConnectionRule(ruleId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionRule, ruleId));
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getTargetItemTypeByRule(ruleId: Guid, connections: FullConnection[]) {
    console.log(connections);
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
  }

  getTargetColorByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections && connections.length > 0) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
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

  onAddConnection(ruleId: Guid) {}

}
