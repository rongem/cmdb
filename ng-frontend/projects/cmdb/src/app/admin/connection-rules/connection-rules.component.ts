import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ConnectionRule, AdminActions, MetaDataSelectors, AdminFunctions } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';

import { EditRuleComponent } from './edit-rule/edit-rule.component';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit {
  upperItemTypeId: string;
  lowerItemTypeId: string;
  connectionTypeId: string;

  private rulesCount = new Map<string, Observable<number>>();

  constructor(private store: Store<fromApp.AppState>,
              private http: HttpClient,
              private dialog: MatDialog) { }

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

  onEditRule(connectionRule: ConnectionRule) {
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: { connectionRule, createMode: false },
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
    const connectionRule: ConnectionRule = {
      id: undefined,
      upperItemTypeId: this.upperItemTypeId,
      lowerItemTypeId: this.lowerItemTypeId,
      connectionTypeId: this.connectionTypeId,
      maxConnectionsToLower: 1,
      maxConnectionsToUpper: 1,
      validationExpression: '^.*$',
    };
    const dialogRef = this.dialog.open(EditRuleComponent, {
      width: 'auto',
      data: { connectionRule, createMode: true },
    });
    dialogRef.afterClosed().subscribe((value: ConnectionRule) => {
      if (value) {
        this.store.dispatch(AdminActions.addConnectionRule({connectionRule}));
      }
    });
  }

  onDeleteRule(connectionRule: ConnectionRule) {
    this.store.dispatch(AdminActions.deleteConnectionRule({connectionRule}));
  }

  getRulesCount(connectionRule: ConnectionRule) {
    if (!this.rulesCount.has(connectionRule.id)) {
      this.rulesCount.set(connectionRule.id, AdminFunctions.countConnectionsForConnectionRule(this.http, connectionRule.id));
    }
    return this.rulesCount.get(connectionRule.id);
  }

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId));
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connTypeId));
  }
}
