import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectAdmin from 'src/app/admin/store/admin.selectors';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AdminService } from 'src/app/admin/admin.service';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';

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

  onCancel() {
    this.dialogRef.close();
  }

  countRules(rulesToUpper: ConnectionRule[], rulesToLower: ConnectionRule[]) {
    return rulesToUpper.length + rulesToLower.length;
  }

  getAttributeGroups() {
    return this.store.pipe(select(fromSelectAdmin.selectAttributeGroupIdsForCurrentItemType));
  }

  getAttributeTypes() {
    return this.store.pipe(select(fromSelectAdmin.selectAttributeTypesForCurrentItemType));
  }

  selectConnectionRulesToLower() {
    return this.store.pipe(select(fromSelectAdmin.selectConnectionRulesForCurrentIsUpperItemType));
  }

  selectConnectionRulesToUpper() {
    return this.store.pipe(select(fromSelectAdmin.selectConnectionRulesForCurrentIsLowerItemType));
  }
}
