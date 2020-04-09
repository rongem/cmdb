import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guid, FullConfigurationItem, ConnectionRule, ConfigurationItem, Functions, StoreConstants } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';

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
  private availableItemsForRule: Map<Guid, Observable<ConfigurationItem[]>> = new Map();

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder,
              private http: HttpClient) { }

  ngOnInit() {
    this.connectionsToDelete = this.form.get('connectionsToAdd') as FormArray;
    // find rules that have enough connections to upper left for all items
    this.connectionRules.filter(rule => rule.MaxConnectionsToUpper >= this.items.length).forEach(rule => {
      // find rules that have enough connections to lower left for all items
      const spaceLeft = this.items.every(item => {
        const conns = item.connectionsToLower.filter(conn => conn.ruleId === rule.RuleId);
        return (conns.length < rule.MaxConnectionsToLower);
      });
      if (spaceLeft === true) {
        this.rules.push(rule);
      }
    });
    this.rules.forEach(rule => this.connectionsToDelete.push(this.fb.group({
      add: false,
      ruleId: rule.RuleId,
      description: '',
      targetId: Guid.EMPTY,
    }, { validators: [this.validateConnectionToAdd]})));
  }

  getItemType(typeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, typeId);
  }

  getConnectionType(typeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, typeId);
  }

  getAvailableItems(ruleId: Guid) {
    if (!this.availableItemsForRule.has(ruleId)) {
      this.availableItemsForRule.set(ruleId, this.http.get<ConfigurationItem[]>(
        Functions.getUrl(StoreConstants.CONFIGURATIONITEM + StoreConstants.AVAILABLE + ruleId + '/' + this.items.length)).pipe(
          map(configurationItems => {
            return configurationItems.filter(item => this.items.every(i => {
              return i.connectionsToLower.findIndex(c => c.ruleId === ruleId && c.targetId === item.ItemId) === -1;
            }));
          })
        ));
    }
    return this.availableItemsForRule.get(ruleId);
  }

  validateConnectionToAdd(c: FormGroup) {
    return c.value.add === true && c.value.targetId === Guid.EMPTY ? 'target must be set' : null;
  }

}
