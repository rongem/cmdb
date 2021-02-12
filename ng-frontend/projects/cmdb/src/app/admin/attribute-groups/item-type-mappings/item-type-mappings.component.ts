import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ItemType, ItemTypeAttributeGroupMapping, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

import { ConfirmDeleteMappingComponent } from 'projects/cmdb/src/app/admin/shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-attribute-group-item-type-mappings',
  templateUrl: './item-type-mappings.component.html',
  styleUrls: ['./item-type-mappings.component.scss']
})
export class AttributeGroupItemTypeMappingsComponent implements OnInit, OnDestroy {
  private mappings: ItemTypeAttributeGroupMapping[];
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AttributeGroupItemTypeMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeGroup,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // better: take(1) ?
    this.subscription = this.store.select(MetaDataSelectors.selectItemTypeAttributeGroupMappings).subscribe(mappings => {
      this.mappings = mappings.filter(m => m.attributeGroupId === this.data.id);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: string) {
    return attributeTypes.filter(at => at.attributeGroupId === attributeGroupId)
      .map(at => at.name).join('\n');
  }

  onChange(event: MatSlideToggleChange, itemType: ItemType) {
    if (event.checked) {
      const mapping: ItemTypeAttributeGroupMapping = {
        attributeGroupId: this.data.id,
        itemTypeId: itemType.id,
      };
      this.store.dispatch(AdminActions.addItemTypeAttributeGroupMapping({mapping}));
    } else {
      const mapping = this.mappings.find(m => m.itemTypeId === itemType.id);
      const dialogRef = this.dialog.open(ConfirmDeleteMappingComponent, {
        width: 'auto',
        // class:
        data: mapping,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.store.dispatch(AdminActions.deleteItemTypeAttributeGroupMapping({mapping}));
        } else {
          event.source.checked = true;
        }
      });
    }
  }

  isSelected(guid: string) {
    return this.mappings.findIndex(m => m.itemTypeId === guid) > -1;
  }
}
