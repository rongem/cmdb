import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { Guid } from 'src/app/shared/guid';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit {

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get connectionTypesToLower() {
    return this.store.select(fromSelectDisplay.selectUsedConnectionTypeGroupsToLower);
  }

  get connectionTypesToUpper() {
    return this.store.select(fromSelectDisplay.selectUsedConnectionTypeGroupsToUpper);
  }

  get connectionsCount() {
    return this.store.select(fromSelectDisplay.selectConnectionsCount);
  }

  get userRole() {
    return this.store.select(fromSelectMetaData.selectUserRole);
  }

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, connTypeId);
  }

  getConnectionRuleIdsToLower(guid: Guid) {
    return this.store.select(fromSelectDisplay.selectUsedConnectionRuleIdsToLowerByType, guid);
  }

  getConnectionRuleIdsToUpper(guid: Guid) {
    return this.store.select(fromSelectDisplay.selectUsedConnectionRuleIdsToUpperByType, guid);
  }

  getTargetItemTypeByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
  }

  getTargetColorByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
  }
}
