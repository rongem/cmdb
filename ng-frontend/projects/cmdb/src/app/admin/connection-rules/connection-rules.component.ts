import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { ConnectionRule, AdminActions, MetaDataSelectors, AdminFunctions, ItemType, ConnectionType, ValidatorService } from 'backend-access';


@Component({
    selector: 'app-connection-rules',
    templateUrl: './connection-rules.component.html',
    styleUrls: ['./connection-rules.component.scss'],
    standalone: false
})
export class ConnectionRulesComponent implements OnInit {
  upperItemType?: ItemType;
  lowerItemType?: ItemType;
  selectedConnectionType?: ConnectionType;
  selectedConnectionRule?: ConnectionRule;
  activeLine = -1;
  ruleForm: UntypedFormGroup;
  private rulesCount = new Map<string, Observable<number>>();

  constructor(private store: Store,
              private http: HttpClient,
              private val: ValidatorService,
              private fb: UntypedFormBuilder) { }

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

  get canCreateNew() {
    return this.filteredConnectionRules.pipe(
      map(connectionRules => connectionRules.length === 0 && this.upperItemType && this.lowerItemType && this.selectedConnectionType &&
        this.upperItemType.id !== this.lowerItemType.id
      ),
      tap(result => {
        if (result && !this.ruleForm) {
          this.fillForm();
        } else if (!result && this.ruleForm) {
          this.ruleForm = undefined;
        }
      }),
    );
  }

  ngOnInit() {
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

  onCreateRule() {
    if (!this.upperItemType || !this.lowerItemType || !this.selectedConnectionType) {
      return;
    }
    if (!this.ruleForm.valid) {
      return;
    }
    const connectionRule: ConnectionRule = {
      ...this.ruleForm.value,
      id: undefined,
      upperItemTypeId: this.upperItemType.id,
      lowerItemTypeId: this.lowerItemType.id,
      connectionTypeId: this.selectedConnectionType.id,
    };
    this.store.dispatch(AdminActions.addConnectionRule({connectionRule}));
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

  private fillForm() {
    this.ruleForm = this.fb.group({
      maxConnectionsToLower: [this.selectedConnectionRule?.maxConnectionsToLower,
      [Validators.required, Validators.max(9999), Validators.min(1)]],
      maxConnectionsToUpper: [this.selectedConnectionRule?.maxConnectionsToUpper,
      [Validators.required, Validators.max(9999), Validators.min(1)]],
      validationExpression: [this.selectedConnectionRule?.validationExpression ?? '^.*$',
      [Validators.required, this.val.validateRegex]],
    });
  }
}
