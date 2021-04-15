import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConnectionRule, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';


@Component({
  selector: 'app-edit-rule',
  templateUrl: './edit-rule.component.html',
  styleUrls: ['./edit-rule.component.scss']
})
export class EditRuleComponent implements OnInit {
  ruleForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditRuleComponent>,
              private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { connectionRule: ConnectionRule; createMode: boolean }) { }

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      maxConnectionsToLower: [this.data.connectionRule.maxConnectionsToLower,
        [Validators.required, Validators.max(9999), Validators.min(1)]],
      maxConnectionsToUpper: [this.data.connectionRule.maxConnectionsToUpper,
        [Validators.required, Validators.max(9999), Validators.min(1)]],
      validationExpression: [this.data.connectionRule.validationExpression,
        [Validators.required, this.validRegex]],
    }, {validators: this.validForm});
  }

  validRegex: ValidatorFn = (c: FormControl) => {
    const content = (c.value as string).trim();
    if (!content || !content.startsWith('^') || !content.endsWith('$')) {
      return {noFullLineRegexpError: true};
    }
    try {
      const regex = RegExp(c.value);
    } catch (e) {
      return e;
    }
    return null;
  };

  validForm: ValidatorFn = (c: FormGroup) => {
    if (!this.data.createMode &&
        this.data.connectionRule.maxConnectionsToUpper === c.value.maxConnectionsToUpper &&
        this.data.connectionRule.maxConnectionsToLower === c.value.maxConnectionsToLower &&
        this.data.connectionRule.validationExpression === c.value.validationExpression) {
      return {nothingChangedError: true};
    }
    return null;
  };

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, connTypeId);
  }

  onSubmit() {
    // console.log(this.ruleForm);
    if (this.ruleForm.invalid) {
      return;
    }
    const connectionRule: ConnectionRule = {
      ...this.data.connectionRule,
      maxConnectionsToLower: this.ruleForm.value.maxConnectionsToLower,
      maxConnectionsToUpper: this.ruleForm.value.maxConnectionsToUpper,
      validationExpression: this.ruleForm.value.validationExpression,
    };
    this.dialogRef.close(connectionRule);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
