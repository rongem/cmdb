import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ConnectionRule, AdminActions, MetaDataSelectors, AdminFunctions, ItemType, ConnectionType } from 'backend-access';

import { EditRuleComponent } from './edit-rule/edit-rule.component';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit {
  upperItemType: ItemType;
  lowerItemType: ItemType;
  selectedConnectionType: ConnectionType;
  activeLine = -1;
  createMode = false;
  private rulesCount = new Map<string, Observable<number>>();

  constructor(private store: Store,
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
    return this.store.select(MetaDataSelectors.selectConnectionRules).pipe(
      map(connectionRules => this.filterConnectionRules(connectionRules)),
    );
  }

  filterConnectionRules(allConnectionRules: ConnectionRule[]) {
    let filteredConnectionRules = allConnectionRules.slice();
    if (this.upperItemType) {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.upperItemTypeId === this.upperItemType.id);
    }
    if (this.lowerItemType) {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.lowerItemTypeId === this.lowerItemType.id);
    }
    if (this.selectedConnectionType) {
      filteredConnectionRules = filteredConnectionRules.filter(r => r.connectionTypeId === this.selectedConnectionType.id);
    }
    return filteredConnectionRules;
  }

  onEditRule(connectionRule: ConnectionRule) {
    this.createMode = false;
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
    if (!this.upperItemType || !this.lowerItemType || !this.selectedConnectionType) {
      return;
    }
    this.createMode = true;
    const connectionRule: ConnectionRule = {
      id: undefined,
      upperItemTypeId: this.upperItemType.id,
      lowerItemTypeId: this.lowerItemType.id,
      connectionTypeId: this.selectedConnectionType.id,
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
