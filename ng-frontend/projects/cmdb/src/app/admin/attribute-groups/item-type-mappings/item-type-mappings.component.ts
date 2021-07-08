import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ItemType, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import { ConfirmDeleteMappingComponent } from '../../shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-attribute-group-item-type-mappings',
  templateUrl: './item-type-mappings.component.html',
  styleUrls: ['./item-type-mappings.component.scss']
})
export class AttributeGroupItemTypeMappingsComponent implements OnInit, OnDestroy {
  private itemTypesWithAttributeGroup: ItemType[];
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AttributeGroupItemTypeMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeGroup,
    public dialog: MatDialog,
    private store: Store) { }

  ngOnInit() {
    this.subscription = this.store.select(MetaDataSelectors.selectItemTypesByAttributeGroup(this.data.id)).subscribe(itemTypes => {
      this.itemTypesWithAttributeGroup = itemTypes;
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
      const updatedItemType = ItemType.copy(itemType);
      updatedItemType.attributeGroups.push(this.data);
      this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    } else {
      const dialogRef = this.dialog.open(ConfirmDeleteMappingComponent, {
        width: 'auto',
        // class:
        data: {itemType, attributeGroupId: this.data.id},
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          const updatedItemType = ItemType.copy(itemType);
          updatedItemType.attributeGroups = updatedItemType.attributeGroups.filter(ag => ag.id !== this.data.id);
          this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
        } else {
          event.source.checked = true;
        }
      });
    }
  }

  isSelected(id: string) {
    return this.itemTypesWithAttributeGroup.findIndex(m => m.id === id) > -1;
  }
}
