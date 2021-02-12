import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FullConfigurationItem, ConnectionRule, ConfigurationItem, MetaDataSelectors, ReadFunctions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-multi-add-connections',
  templateUrl: './multi-add-connections.component.html',
  styleUrls: ['./multi-add-connections.component.scss']
})
export class MultiAddConnectionsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  @Input() connectionRules: ConnectionRule[];
  rules: ConnectionRule[] = [];
  private connectionsToDelete: FormArray;
  private availableItemsForRule = new Map<string, Observable<ConfigurationItem[]>>();

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private http: HttpClient) { }

  ngOnInit() {
    this.connectionsToDelete = this.form.get('connectionsToAdd') as FormArray;
    // find rules that have enough connections to upper left for all items
    this.connectionRules.filter(rule => rule.maxConnectionsToUpper >= this.items.length).forEach(rule => {
      // find rules that have enough connections to lower left for all items
      const spaceLeft = this.items.every(item => {
        const conns = item.connectionsToLower.filter(conn => conn.ruleId === rule.id);
        return (conns.length < rule.maxConnectionsToLower);
      });
      if (spaceLeft === true) {
        this.rules.push(rule);
      }
    });
    this.rules.forEach(rule => this.connectionsToDelete.push(this.fb.group({
      add: false,
      ruleId: rule.id,
      description: '',
      targetId: '',
    }, { validators: [this.validateConnectionToAdd]})));
  }

  getItemType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, typeId);
  }

  getConnectionType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType, typeId);
  }

  getAvailableItems(ruleId: string) {
    if (!this.availableItemsForRule.has(ruleId)) {
      this.availableItemsForRule.set(ruleId, ReadFunctions.availableItemsForRuleId(this.http, ruleId, this.items.length).pipe(
          map(configurationItems => configurationItems.filter(item => this.items.every(i =>
              i.connectionsToLower.findIndex(c => c.ruleId === ruleId && c.targetId === item.id) === -1
            ))
          )
        ));
    }
    return this.availableItemsForRule.get(ruleId);
  }

  validateConnectionToAdd: ValidatorFn = (c: FormGroup) => {
    return c.value.add === true && c.value.targetId === '' ? {targetNotSetError: true} : null;
  }

}
