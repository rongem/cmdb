import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Guid, ConnectionRule, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

import { AdminService } from 'projects/cmdb/src/app/admin/admin.service';
import { EditRuleComponent } from './edit-rule/edit-rule.component';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit {
  private rulesCount = new Map<string, Observable<number>>();

  upperItemTypeId: string;
  lowerItemTypeId: string;
  connectionTypeId: string;

  constructor(private store: Store<fromApp.AppState>,
              private adminService: AdminService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get connectionTypes() {
    return this.store.select(MetaDataSelectors.selectConnectionTypes);
  }

  get filteredConnectionRules() {
    return this.store.pipe(
      select(MetaDataSelectors.selectConnectionRules),
      map(connectionRules => this.filterConnectionRules(connectionRules)),
    );
  }

  filterConnectionRules(allConnectionRules: ConnectionRule[]) {
    let filteredConnectionRules = allConnectionRules.slice();
    if (this.upperItemTypeId && this.upperItemTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.upperItemTypeId === this.upperItemTypeId);
    }
    if (this.lowerItemTypeId && this.lowerItemTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.lowerItemTypeId === this.lowerItemTypeId);
    }
    if (this.connectionTypeId && this.connectionTypeId.toString() !== 'undefined') {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.connectionTypeId === this.connectionTypeId);
    }
    return filteredConnectionRules;
  }

  onEditRule(rule: ConnectionRule) {
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: {rule, createMode: false},
    });
    dialogRef.afterClosed().subscribe((value: ConnectionRule) => {
      if (value) {
        this.store.dispatch(AdminActions.updateConnectionRule({connectionRule: value}));
      }
    });
  }

  onCreateRule() {
    if (!this.upperItemTypeId || !this.lowerItemTypeId || !this.connectionTypeId) {
      return;
    }
    const rule: ConnectionRule = {
      id: Guid.create().toString(),
      upperItemTypeId: this.upperItemTypeId,
      lowerItemTypeId: this.lowerItemTypeId,
      connectionTypeId: this.connectionTypeId,
      maxConnectionsToLower: 1,
      maxConnectionsToUpper: 1,
      validationExpression: '^.*$',
    };
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: {rule, createMode: true},
    });
    dialogRef.afterClosed().subscribe((value: ConnectionRule) => {
      if (value) {
        this.store.dispatch(AdminActions.addConnectionRule({connectionRule: rule}));
      }
    });
  }

  onDeleteRule(rule: ConnectionRule) {
    this.store.dispatch(AdminActions.deleteConnectionRule({connectionRule: rule}));
  }

  getRulesCount(rule: ConnectionRule) {
    if (!this.rulesCount.has(rule.id)) {
      this.rulesCount.set(rule.id, this.adminService.countConnectionsForConnectionRule(rule.id));
    }
    return this.rulesCount.get(rule.id);
  }

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, connTypeId);
  }
}
