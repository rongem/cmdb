import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { FullConnection } from 'src/app/shared/objects/full-connection.model';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;

  get connectionTypesToLower() {
    return this.store.pipe(select(fromSelectDisplay.selectUsedConnectionTypeGroupsToLower));
  }

  get connectionTypesToUpper() {
    return this.store.pipe(select(fromSelectDisplay.selectUsedConnectionTypeGroupsToUpper));
  }

  get connectionsCount() {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionsCount));
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleConnectionType, connTypeId));
  }

  getConnectionRuleIdsToLower(guid: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectUsedConnectionRuleIdsToLowerByType, guid));
  }

  getConnectionRuleIdsToUpper(guid: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectUsedConnectionRuleIdsToUpperByType, guid));
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
