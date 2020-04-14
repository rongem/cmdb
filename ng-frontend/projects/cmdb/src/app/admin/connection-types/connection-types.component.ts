import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid, ConnectionType, ConnectionRule, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-connection-types',
  templateUrl: './connection-types.component.html',
  styleUrls: ['./connection-types.component.scss']
})
export class ConnectionTypesComponent implements OnInit {
  readonly minLength = 2;
  activeType: string;
  typeName: string;
  typeReverseName: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get connectionTypes() {
    return this.store.select(MetaDataSelectors.selectConnectionTypes);
  }

  get connectionRules() {
    return this.store.select(MetaDataSelectors.selectConnectionRules);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = '';
    this.typeReverseName = '';
    this.createMode = true;
  }

  onSetType(connectionType: ConnectionType) {
    this.activeType = connectionType.id;
    this.typeName = connectionType.name;
    this.typeReverseName = undefined;
    this.createMode = false;
  }

  onSetTypeReverse(connectionType: ConnectionType) {
    this.activeType = connectionType.id;
    this.typeName = undefined;
    this.typeReverseName = connectionType.reverseName;
    this.createMode = false;
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.typeReverseName = undefined;
    this.createMode = false;
  }

  onCreateConnectionType() {
    if (!this.typeName || !this.typeReverseName ||
      this.typeName.length < this.minLength || this.typeReverseName.length < this.minLength) {
        return;
    }
    const connectionType: ConnectionType = {
      id: Guid.create().toString(),
      name: this.typeName,
      reverseName: this.typeReverseName,
    };
    this.store.dispatch(AdminActions.addConnectionType({connectionType}));
    this.onCancel();
  }

  onChangeTypeName(text: string, connectionType: ConnectionType) {
    const updatedType: ConnectionType = {
      ...connectionType,
      name: text,
    };
    this.store.dispatch(AdminActions.updateConnectionType({connectionType: updatedType}));
    this.onCancel();
  }

  onChangeTypeReverseName(text: string, connectionType: ConnectionType) {
    const updatedType: ConnectionType = {
      ...connectionType,
      reverseName: text,
    };
    this.store.dispatch(AdminActions.updateConnectionType({connectionType: updatedType}));
    this.onCancel();
  }

  onDeleteConnectionType(connectionType: ConnectionType) {
    this.store.dispatch(AdminActions.deleteConnectionType({connectionType}));
    this.onCancel();
  }

  canDelete(connectionType: ConnectionType, connectionRules: ConnectionRule[]) {
    return connectionRules.filter(r => r.connectionTypeId === connectionType.id).length === 0;
  }

}
