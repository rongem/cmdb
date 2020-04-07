import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ItemType, ConfigurationItem, ConnectionRule } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectAdmin from '../../store/admin.selectors';

import { AdminService } from '../../admin.service';

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
