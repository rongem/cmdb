import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ItemType, ConnectionRule, ReadFunctions, ConfigurationItem } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectAdmin from '../../store/admin.selectors';

@Component({
  selector: 'app-delete-item-type',
  templateUrl: './delete-item-type.component.html',
  styleUrls: ['./delete-item-type.component.scss']
})
export class DeleteItemTypeComponent implements OnInit {
  private items$: Observable<ConfigurationItem[]>;
  constructor(
    public dialogRef: MatDialogRef<DeleteItemTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  countRules(rulesToUpper: ConnectionRule[], rulesToLower: ConnectionRule[]) {
    return rulesToUpper.length + rulesToLower.length;
  }

  get attributeGroups() {
    return this.store.select(fromSelectAdmin.selectAttributeGroupIdsForCurrentItemType);
  }

  get attributeTypes() {
    return this.store.select(fromSelectAdmin.selectAttributeTypesForCurrentItemType);
  }

  get connectionRulesToLower() {
    return this.store.select(fromSelectAdmin.selectConnectionRulesForCurrentIsUpperItemType);
  }

  get connectionRulesToUpper() {
    return this.store.select(fromSelectAdmin.selectConnectionRulesForCurrentIsLowerItemType);
  }

  get items() {
    if (!this.items$) {
      this.items$ = ReadFunctions.configurationItemsByTypes(this.http, [this.data.id]);
    }
    return this.items$;
  }
}
