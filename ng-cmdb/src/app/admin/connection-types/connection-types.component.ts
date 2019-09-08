import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as AdminActions from 'src/app/admin/store/admin.actions';

import { ConnectionType } from 'src/app/shared/objects/connection-type.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';

@Component({
  selector: 'app-connection-types',
  templateUrl: './connection-types.component.html',
  styleUrls: ['./connection-types.component.scss']
})
export class ConnectionTypesComponent implements OnInit {
  readonly minLength = 4;
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  typeName: string;
  typeReverseName: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = '';
    this.typeReverseName = '';
    this.createMode = true;
  }

  onSetType(connectionType: ConnectionType) {
    this.activeType = connectionType.ConnTypeId;
    this.typeName = connectionType.ConnTypeName;
    this.typeReverseName = undefined;
    this.createMode = false;
  }

  onSetTypeReverse(connectionType: ConnectionType) {
    this.activeType = connectionType.ConnTypeId;
    this.typeName = undefined;
    this.typeReverseName = connectionType.ConnTypeReverseName;
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
      ConnTypeId: Guid.create(),
      ConnTypeName: this.typeName,
      ConnTypeReverseName: this.typeReverseName,
    };
    this.store.dispatch(AdminActions.addConnectionType({connectionType}));
    this.onCancel();
  }

  onChangeTypeName(text: string, connectionType: ConnectionType) {
    const updatedType: ConnectionType = {
      ...connectionType,
      ConnTypeName: text,
    };
    this.store.dispatch(AdminActions.updateConnectionType({connectionType: updatedType}));
    this.onCancel();
  }

  onChangeTypeReverseName(text: string, connectionType: ConnectionType) {
    const updatedType: ConnectionType = {
      ...connectionType,
      ConnTypeReverseName: text,
    };
    this.store.dispatch(AdminActions.updateConnectionType({connectionType: updatedType}));
    this.onCancel();
  }

  onDeleteConnectionType(connectionType: ConnectionType) {
    this.store.dispatch(AdminActions.deleteConnectionType({connectionType}));
    this.onCancel();
  }

  canDelete(connectionType: ConnectionType, connectionRules: ConnectionRule[]) {
    return connectionRules.filter(r => r.ConnType === connectionType.ConnTypeId).length === 0;
  }

}
