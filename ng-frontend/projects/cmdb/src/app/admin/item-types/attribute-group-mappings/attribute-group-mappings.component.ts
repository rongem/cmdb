import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Guid } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromMetaData from 'projects/cmdb/src/app/shared/store/meta-data.reducer';
import * as AdminActions from 'projects/cmdb/src/app/admin/store/admin.actions';

import { ItemType } from 'projects/cmdb/src/app/shared/objects/item-type.model';
import { ItemTypeAttributeGroupMapping } from 'projects/cmdb/src/app/shared/objects/item-type-attribute-group-mapping.model';
import { AttributeType } from 'projects/cmdb/src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'projects/cmdb/src/app/shared/objects/attribute-group.model';
import { ConfirmDeleteMappingComponent } from '../../shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit, OnDestroy {
  meta: Observable<fromMetaData.State>;
  private mappings: ItemTypeAttributeGroupMapping[];
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ItemTypeAttributeGroupMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.subscription = this.meta.subscribe(state => {
      this.mappings = state.itemTypeAttributeGroupMappings.filter(m => m.ItemTypeId === this.data.TypeId);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: Guid) {
    return attributeTypes.filter(at => at.AttributeGroup === attributeGroupId)
      .map(at => at.TypeName).join('\n');
  }

  onChange(event: MatSlideToggleChange, attributeGroup: AttributeGroup) {
    if (event.checked) {
      const mapping: ItemTypeAttributeGroupMapping = {
        GroupId: attributeGroup.GroupId,
        ItemTypeId: this.data.TypeId,
      };
      this.store.dispatch(AdminActions.addItemTypeAttributeGroupMapping({mapping}));
    } else {
      const mapping = this.mappings.find(m => m.GroupId === attributeGroup.GroupId);
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

  isSelected(guid: Guid) {
    return this.mappings.findIndex(m => m.GroupId === guid) > -1;
  }
}
