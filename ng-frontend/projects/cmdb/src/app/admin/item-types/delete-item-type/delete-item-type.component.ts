import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectAdmin from 'projects/cmdb/src/app/admin/store/admin.selectors';

import { ItemType } from 'projects/cmdb/src/app/shared/objects/item-type.model';
import { AdminService } from 'projects/cmdb/src/app/admin/admin.service';
import { ConfigurationItem } from 'projects/cmdb/src/app/shared/objects/configuration-item.model';
import { ConnectionRule } from 'projects/cmdb/src/app/shared/objects/connection-rule.model';

@Component({
  selector: 'app-delete-item-type',
  templateUrl: './delete-item-type.component.html',
  styleUrls: ['./delete-item-type.component.scss']
})
export class DeleteItemTypeComponent implements OnInit {
  items: Observable<ConfigurationItem[]>;

  constructor(
    public dialogRef: MatDialogRef<DeleteItemTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    private adminService: AdminService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    (this.items = this.adminService.getItemsForItemType(this.data)).subscribe();
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
}
