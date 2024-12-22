import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, skipWhile, take } from 'rxjs';
import { AdminActions, ConnectionRule, MetaDataSelectors, ValidatorService } from 'backend-access';


@Component({
    selector: 'app-edit-rule',
    templateUrl: './edit-rule.component.html',
    styleUrls: ['./edit-rule.component.scss'],
    standalone: false
})
export class EditRuleComponent implements OnInit {
  ruleForm: UntypedFormGroup;
  ruleId: string;
  rule: ConnectionRule;

  constructor(public route: ActivatedRoute,
              private router: Router,
              private store: Store,
              private validator: ValidatorService,
              private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.id && this.route.snapshot.routeConfig.path.startsWith('connection-rule/:id')) {
      this.ruleId = this.route.snapshot.params.id;
      this.store.select(MetaDataSelectors.selectState).pipe(
        withLatestFrom(this.store.select(MetaDataSelectors.selectSingleConnectionRule(this.ruleId))),
        skipWhile(([status, ]) => status.validData === false),
        map(([, connectionRule]) => connectionRule),
        take(1),
      ).subscribe(connectionRule => {
        if (connectionRule === undefined) {
          console.log('No connection rule with id ' + this.ruleId + ' found');
          this.onCancel();
        }
        this.rule = connectionRule;
        this.ruleForm = this.fb.group({
          id: connectionRule.id,
          upperItemTypeId: connectionRule.upperItemTypeId,
          lowerItemTypeId: connectionRule.lowerItemTypeId,
          connectionTypeId: connectionRule.connectionTypeId,
          maxConnectionsToLower: [connectionRule.maxConnectionsToLower,
            [Validators.required, Validators.max(9999), Validators.min(1)]],
          maxConnectionsToUpper: [connectionRule.maxConnectionsToUpper,
            [Validators.required, Validators.max(9999), Validators.min(1)]],
          validationExpression: [connectionRule.validationExpression,
            [Validators.required, this.validator.validateRegex]],
        }, {validators: this.validForm});
      });
    } else {
      console.log('illegal id params');
      this.onCancel();
    }
  }

  validForm: ValidatorFn = (c: AbstractControl) => {
    if (this.rule.maxConnectionsToUpper === c.value.maxConnectionsToUpper &&
        this.rule.maxConnectionsToLower === c.value.maxConnectionsToLower &&
        this.rule.validationExpression === c.value.validationExpression) {
      return {nothingChangedError: true};
    }
    return null;
  };

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId));
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connTypeId));
  }

  onSubmit() {
    // console.log(this.ruleForm);
    if (this.ruleForm.invalid) {
      return;
    }
    const connectionRule = this.ruleForm.value as ConnectionRule;
    this.store.dispatch(AdminActions.updateConnectionRule({connectionRule}));
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['admin', 'connection-rules']);
  }
}
