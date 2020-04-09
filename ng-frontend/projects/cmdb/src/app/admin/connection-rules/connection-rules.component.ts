import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Guid, ConnectionRule, AdminActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';

import { AdminService } from 'projects/cmdb/src/app/admin/admin.service';
import { EditRuleComponent } from './edit-rule/edit-rule.component';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit {
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
    return filteredConnectionRules;
  }

  onEditRule(rule: ConnectionRule) {
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: {rule, createMode: false},
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value && value instanceof ConnectionRule) {
        this.store.dispatch(AdminActions.updateConnectionRule({connectionRule: value}));
      }
    });
  }

  onCreateRule() {
    if (!this.upperItemTypeId || !this.lowerItemTypeId || !this.connectionTypeId) {
      return;
    }
    const rule: ConnectionRule = {
      RuleId: Guid.create(),
      ItemUpperType: this.upperItemTypeId,
      ItemLowerType: this.lowerItemTypeId,
      ConnType: this.connectionTypeId,
      MaxConnectionsToLower: 1,
      MaxConnectionsToUpper: 1,
      ValidationExpression: '^.*$',
    };
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: {rule, createMode: true},
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value && value instanceof ConnectionRule) {
        this.store.dispatch(AdminActions.addConnectionRule({connectionRule: rule}));
      }
    });
  }

  onDeleteRule(rule: ConnectionRule) {
    this.store.dispatch(AdminActions.deleteConnectionRule({connectionRule: rule}));
  }

  getRulesCount(rule: ConnectionRule) {
    if (!this.rulesCount.has(rule.RuleId)) {
      this.rulesCount.set(rule.RuleId, this.adminService.countConnectionsForConnectionRule(rule.RuleId));
    }
    return this.rulesCount.get(rule.RuleId);
  }

  getItemType(itemTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, connTypeId);
  }
}
