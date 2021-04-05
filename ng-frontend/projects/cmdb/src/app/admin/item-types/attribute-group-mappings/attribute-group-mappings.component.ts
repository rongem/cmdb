import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { ItemType, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';

import { ConfirmDeleteMappingComponent } from '../../shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<ItemTypeAttributeGroupMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  get attributeGroups() {
    return this.store.select(MetaDataSelectors.selectAttributeGroups);
  }

  get attributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypes);
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: string) {
    return attributeTypes.filter(at => at.attributeGroupId === attributeGroupId)
      .map(at => at.name).join('\n');
  }

  onChange(event: MatSlideToggleChange, attributeGroup: AttributeGroup) {
    if (event.checked) {
      const updatedItemType = ItemType.copy(this.data);
      updatedItemType.attributeGroups.push(attributeGroup);
      this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    } else {
      const dialogRef = this.dialog.open(ConfirmDeleteMappingComponent, {
        width: 'auto',
        // class:
        data: {itemType: this.data, attributeGroupId: attributeGroup.id},
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          const updatedItemType = ItemType.copy(this.data);
          updatedItemType.attributeGroups = updatedItemType.attributeGroups.filter(ag => ag.id !== attributeGroup.id);
          this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
        } else {
          event.source.checked = true;
        }
      });
    }
  }

  isSelected(id: string) {
    return this.data.attributeGroups.findIndex(ag => ag.id === id) > -1;
  }
}
