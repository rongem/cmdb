import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as AdminActions from 'src/app/admin/store/admin.actions';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';
import { ConfirmDeleteMappingComponent } from 'src/app/admin/shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-attribute-group-item-type-mappings',
  templateUrl: './item-type-mappings.component.html',
  styleUrls: ['./item-type-mappings.component.scss']
})
export class AttributeGroupItemTypeMappingsComponent implements OnInit, OnDestroy {
  meta: Observable<fromMetaData.State>;
  private mappings: ItemTypeAttributeGroupMapping[];
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AttributeGroupItemTypeMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeGroup,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.subscription = this.meta.subscribe(state => {
      this.mappings = state.itemTypeAttributeGroupMappings.filter(m => m.GroupId === this.data.GroupId);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: Guid) {
    return attributeTypes.filter(at => at.AttributeGroup === attributeGroupId)
      .map(at => at.TypeName).join('\n');
  }

  onChange(event: MatSlideToggleChange, itemType: ItemType) {
    if (event.checked) {
      const mapping: ItemTypeAttributeGroupMapping = {
        GroupId: this.data.GroupId,
        ItemTypeId: itemType.TypeId,
      };
      this.store.dispatch(AdminActions.addItemTypeAttributeGroupMapping({mapping}));
    } else {
      const mapping = this.mappings.find(m => m.ItemTypeId === itemType.TypeId);
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

  onCancel() {
    this.dialogRef.close();
  }

  isSelected(guid: Guid) {
    return this.mappings.findIndex(m => m.ItemTypeId === guid) > -1;
  }
}
