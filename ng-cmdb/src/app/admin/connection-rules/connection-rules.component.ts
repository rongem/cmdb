import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as AdminActions from 'src/app/admin/store/admin.actions';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { AdminService } from 'src/app/admin/admin.service';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit {
  activeRule: Guid;
  maxConnectionsToUpper: number;
  maxConnectionsToLower: number;
  validationExpression: string;
  private rulesCount: Map<Guid, Observable<number>> = new Map<Guid, Observable<number>>();

  upperItemTypeId: Guid;
  lowerItemTypeId: Guid;
  connectionTypeId: Guid;

  constructor(private store: Store<fromApp.AppState>,
              private adminService: AdminService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get itemTypes() {
    return this.store.select(fromSelectMetaData.selectItemTypes);
  }

  get connectionTypes() {
    return this.store.select(fromSelectMetaData.selectConnectionTypes);
  }

  get filteredConnectionRules() {
    return this.store.pipe(
      select(fromSelectMetaData.selectConnectionRules),
      map(connectionRules => this.filterConnectionRules(connectionRules)),
    );
  }

  filterConnectionRules(allConnectionRules: ConnectionRule[]) {
    let filteredConnectionRules = allConnectionRules.slice();
    if (this.upperItemTypeId && this.upperItemTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.ItemUpperType === this.upperItemTypeId);
    }
    if (this.lowerItemTypeId && this.lowerItemTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.ItemLowerType === this.lowerItemTypeId);
    }
    if (this.connectionTypeId && this.connectionTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.ConnType === this.connectionTypeId);
    }
    if (filteredConnectionRules.length === 0) {
      this.maxConnectionsToLower = 1;
      this.maxConnectionsToUpper = 1;
      this.activeRule = undefined;
    }
    return filteredConnectionRules;
  }

  onSetRule(rule: ConnectionRule) {
    this.activeRule = rule.RuleId;
    this.maxConnectionsToUpper = rule.MaxConnectionsToUpper;
    this.maxConnectionsToLower = rule.MaxConnectionsToLower;
    this.validationExpression = rule.ValidationExpression;
  }

  onCancel() {
    this.activeRule = undefined;
    this.maxConnectionsToUpper = undefined;
    this.maxConnectionsToLower = undefined;
    this.validationExpression = undefined;
  }

  isDataInvalid(rule: ConnectionRule) {
    return this.maxConnectionsToLower < 1 || this.maxConnectionsToUpper < 1 ||
    this.maxConnectionsToLower > 9999 || this.maxConnectionsToUpper > 9999 || (
      this.maxConnectionsToUpper === rule.MaxConnectionsToUpper && this.maxConnectionsToLower === rule.MaxConnectionsToLower
      );
  }

  getRulesCount(rule: ConnectionRule) {
    if (!this.rulesCount.has(rule.RuleId)) {
      this.rulesCount.set(rule.RuleId, this.adminService.countConnectionsForConnectionRule(rule.RuleId));
    }
    return this.rulesCount.get(rule.RuleId);
  }

  onCreateRule() {
    if (!this.upperItemTypeId || !this.lowerItemTypeId || !this.connectionTypeId ||
      this.maxConnectionsToLower < 1 || this.maxConnectionsToUpper < 1 ||
      this.maxConnectionsToLower > 9999 || this.maxConnectionsToUpper > 9999) {
      return;
    }
    if (!this.validationExpression || !this.validationExpression.startsWith('^') || !this.validationExpression.endsWith('$'))
    {
      return;
    }
    try {
      const regex = new RegExp(this.validationExpression);
    } catch (e) {
      return;
    }
    const rule: ConnectionRule = {
      RuleId: Guid.create(),
      ItemUpperType: this.upperItemTypeId,
      ItemLowerType: this.lowerItemTypeId,
      ConnType: this.connectionTypeId,
      MaxConnectionsToLower: this.maxConnectionsToLower,
      MaxConnectionsToUpper: this.maxConnectionsToUpper,
      ValidationExpression: this.validationExpression,
    };
    this.store.dispatch(AdminActions.addConnectionRule({connectionRule: rule}));
  }

  onChangeRule(rule: ConnectionRule) {
    if (this.isDataInvalid(rule)) {
      return;
    }
    const updatedRule: ConnectionRule = {
      ...rule,
      MaxConnectionsToLower: this.maxConnectionsToLower,
      MaxConnectionsToUpper: this.maxConnectionsToUpper,
    };
    this.store.dispatch(AdminActions.updateConnectionRule({connectionRule: updatedRule}));
    this.onCancel();
  }

  onDeleteRule(rule: ConnectionRule) {
    this.store.dispatch(AdminActions.deleteConnectionRule({connectionRule: rule}));
    this.onCancel();
  }

  getItemType(itemTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, connTypeId);
  }
}
