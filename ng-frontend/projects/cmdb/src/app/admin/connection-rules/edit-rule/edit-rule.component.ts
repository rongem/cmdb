import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Guid, ConnectionRule, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';


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
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule, createMode: boolean }) { }

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      maxConnectionsToLower: this.fb.control(this.data.rule.MaxConnectionsToLower,
        [Validators.required, Validators.max(9999), Validators.min(1)]),
      maxConnectionsToUpper: this.fb.control(this.data.rule.MaxConnectionsToUpper,
        [Validators.required, Validators.max(9999), Validators.min(1)]),
      validationExpression: this.fb.control(this.data.rule.ValidationExpression,
        [Validators.required, this.validRegex]),
    }, {validators: this.validForm});
  }

  validRegex(c: FormControl) {
    const content = (c.value as string).trim();
    if (!content || !content.startsWith('^') || !content.endsWith('$')) {
      return 'not a full line regexp';
    }
    try {
      const regex = RegExp(c.value);
    } catch (e) {
      return e;
    }
    return null;
  }

  validForm = (c: FormGroup) => {
    if (!this.data.createMode &&
        this.data.rule.MaxConnectionsToUpper === c.value.maxConnectionsToUpper &&
        this.data.rule.MaxConnectionsToLower === c.value.maxConnectionsToLower &&
        this.data.rule.ValidationExpression === c.value.validationExpression) {
      return 'no changes';
    }
    return null;
  }

  getItemType(itemTypeId: Guid) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, itemTypeId);
  }

  getConnectionType(connTypeId: Guid) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, connTypeId);
  }

  onSubmit() {
    console.log(this.ruleForm);
    if (this.ruleForm.invalid) {
      return;
    }
    const connectionRule: ConnectionRule = {
      ...this.data.rule,
      MaxConnectionsToLower: this.ruleForm.value.maxConnectionsToLower,
      MaxConnectionsToUpper: this.ruleForm.value.maxConnectionsToUpper,
      ValidationExpression: this.ruleForm.value.validationExpression,
    };
    this.dialogRef.close(connectionRule);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
