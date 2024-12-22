import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConnectionType, ConnectionRule, AdminActions, MetaDataSelectors } from 'backend-access';

@Component({
    selector: 'app-connection-types',
    templateUrl: './connection-types.component.html',
    styleUrls: ['./connection-types.component.scss'],
    standalone: false
})
export class ConnectionTypesComponent implements OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('reverseNameInput') reverseNameInput: ElementRef;
  readonly minLength = 2;
  form: UntypedFormGroup;
  activeLine = -1;
  lastNameChange = -1;
  lastReverseNameChange = -1;
  createMode = false;
  private activeType: ConnectionType;

  constructor(private store: Store, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  get connectionTypes() {
    return this.store.select(MetaDataSelectors.selectConnectionTypes);
  }

  get connectionRules() {
    return this.store.select(MetaDataSelectors.selectConnectionRules);
  }

  onCreate() {
    this.createForm();
    this.activeType = undefined;
    this.activeLine = -1;
    this.createMode = true;
  }

  onSetActiveLine(connectionType: ConnectionType, index: number, activateColumn: number) {
    this.createForm(connectionType);
    this.activeType = connectionType;
    this.activeLine = index;
    this.createMode = false;
    setTimeout(() => this.getInput(activateColumn)?.focus(), 0);
  }

  onCancel() {
    this.activeType = undefined;
    this.activeLine = -1;
    this.createMode = false;
  }

  onCreateConnectionType() {
    if (this.form.invalid || this.form.pristine) {
      return;
    }
    const connectionType = this.form.value as ConnectionType;
    this.store.dispatch(AdminActions.addConnectionType({connectionType}));
    this.onCancel();
  }

  onChangeConnectionType() {
    if (this.form.invalid || this.form.pristine) {
      return;
    }
    const connectionType = this.form.value as ConnectionType;
    if (!this.activeType || connectionType.id !== this.activeType.id) {
      this.onCancel();
      return;
    }
    // check if anything has changed
    if (connectionType.name === this.activeType.name && connectionType.reverseName === this.activeType.reverseName) {
        this.onCancel();
        return;
    }
    this.lastNameChange = (connectionType.name !== this.activeType.name) ? this.activeLine : -1;
    this.lastReverseNameChange = (connectionType.reverseName !== this.activeType.reverseName) ? this.activeLine : -1;
    this.store.dispatch(AdminActions.updateConnectionType({connectionType}));
    this.onCancel();
  }

  onDeleteConnectionType(connectionType: ConnectionType) {
    this.store.dispatch(AdminActions.deleteConnectionType({connectionType}));
    this.onCancel();
  }

  canDelete(connectionType: ConnectionType, connectionRules: ConnectionRule[]) {
    return connectionRules.filter(r => r.connectionTypeId === connectionType.id).length === 0;
  }

  private createForm(connectionType?: ConnectionType) {
    this.form = this.fb.group({
      id: this.fb.control(connectionType ? connectionType.id : ''),
      name: this.fb.control(connectionType ? connectionType.name : '', [Validators.required, Validators.minLength(this.minLength)]),
      reverseName: this.fb.control(connectionType ? connectionType.reverseName : '', [Validators.required, Validators.minLength(this.minLength)]),
    });
  }

  private getInput(num: number) {
    let elem: HTMLInputElement;
    switch(num) {
      case 1:
        elem = this.nameInput?.nativeElement;
        break;
      case 2:
        elem = this.reverseNameInput?.nativeElement;
        break;
    }
    return elem;
  }

}
