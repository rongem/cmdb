import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';
import { Guid } from 'src/app/shared/guid';

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
  connectionsToDelete: FormArray;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder) { }

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
    })));
  }

  getItemType(typeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, typeId);
  }

  getConnectionType(typeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleConnectionType, typeId);
  }
}
