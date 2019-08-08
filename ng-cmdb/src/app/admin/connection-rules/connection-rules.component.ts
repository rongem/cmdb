import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
export class ConnectionRulesComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  activeRule: Guid;
  private maxConnectionsToUpper: number;
  private maxConnectionsToLower: number;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCreate() {
    this.activeRule = undefined;
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

  isDataInvalid(mclv: number, mcuv: number) {
    return !mclv || !mcuv || mclv < 1 || mcuv < 1 || mclv > 9999 || mcuv > 9999;
  }

  isDataInvalidOrUnchanged(mclv: number, mcuv: number) {
    console.log(mclv, mcuv);
    console.log(this.maxConnectionsToLower, this.maxConnectionsToUpper);
    return this.isDataInvalid(mclv, mcuv) || ((this.maxConnectionsToLower &&
      this.maxConnectionsToUpper) ? (mclv === this.maxConnectionsToLower && mcuv === this.maxConnectionsToUpper) : false);
  }

  onChangeRule(rule: ConnectionRule, maxConnectionsToLower: number, maxConnectionsToUpper: number) {
  }

}
