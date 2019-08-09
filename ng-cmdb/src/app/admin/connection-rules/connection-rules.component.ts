import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';


@Component({
  selector: 'app-connection-rules',
  templateUrl: './connection-rules.component.html',
  styleUrls: ['./connection-rules.component.scss']
})
export class ConnectionRulesComponent implements OnInit, OnDestroy {
  meta: Observable<fromMetaData.State>;
  activeRule: Guid;
  maxConnectionsToUpper: number;
  maxConnectionsToLower: number;
  createMode = false;

  private allConnectionRules: ConnectionRule[];
  filteredConnectionRules: ConnectionRule[];
  private subscription: Subscription;

  upperItemTypeId: Guid;
  lowerItemTypeId: Guid;
  connectionTypeId: Guid;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.subscription = this.meta.subscribe(state => {
      this.allConnectionRules = state.connectionRules;
      this.filterConnectionRules();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterConnectionRules() {
    this.filteredConnectionRules = this.allConnectionRules.slice();
    if (this.upperItemTypeId) {
      this.filteredConnectionRules = this.filteredConnectionRules.filter(r => r.ItemUpperType === this.upperItemTypeId);
    }
    if (this.lowerItemTypeId) {
      this.filteredConnectionRules = this.filteredConnectionRules.filter(r => r.ItemLowerType === this.lowerItemTypeId);
    }
    if (this.connectionTypeId) {
      this.filteredConnectionRules = this.filteredConnectionRules.filter(r => r.ConnType === this.connectionTypeId);
    }
  }

  onCreate() {
    this.activeRule = undefined;
    this.maxConnectionsToUpper = 1;
    this.maxConnectionsToLower = 1;
    this.createMode = true;
  }

  onSetRule(rule: ConnectionRule) {
    this.activeRule = rule.RuleId;
    this.maxConnectionsToUpper = rule.MaxConnectionsToUpper;
    this.maxConnectionsToLower = rule.MaxConnectionsToLower;
    this.createMode = false;
  }

  onCancel() {
    this.activeRule = undefined;
    this.maxConnectionsToUpper = undefined;
    this.maxConnectionsToLower = undefined;
    this.createMode = false;
  }

  isDataInvalid(rule: ConnectionRule) {
    return this.maxConnectionsToLower < 1 || this.maxConnectionsToUpper < 1 ||
      this.maxConnectionsToLower > 9999 || this.maxConnectionsToUpper > 9999 || (
      this.maxConnectionsToUpper === rule.MaxConnectionsToUpper && this.maxConnectionsToLower === rule.MaxConnectionsToLower
    );
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
    this.store.dispatch(new MetaDataActions.UpdateConnectionRule(updatedRule));
    this.onCancel();
  }

  onDeleteRule(rule: ConnectionRule) {
    this.store.dispatch(new MetaDataActions.DeleteConnectionRule(rule));
    this.onCancel();
  }
}
