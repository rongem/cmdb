import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'projects/cmdb/src/app/shared/guid';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromMetaData from 'projects/cmdb/src/app/shared/store/meta-data.reducer';
import * as AdminActions from 'projects/cmdb/src/app/admin/store/admin.actions';

import { ItemType } from 'projects/cmdb/src/app/shared/objects/item-type.model';
import { DeleteItemTypeComponent } from './delete-item-type/delete-item-type.component';
import { ItemTypeAttributeGroupMappingsComponent } from './attribute-group-mappings/attribute-group-mappings.component';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.scss']
})
export class ItemTypesComponent implements OnInit {
  readonly minLength = 4;
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  typeName: string;
  typeBackColor: string;
  attributeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = '';
    this.typeBackColor = '#FFFFFF';
    this.createMode = true;
  }

  onSetType(itemType: ItemType) {
    this.activeType = itemType.TypeId;
    this.typeName = itemType.TypeName;
    this.createMode = false;
  }

  onCreateItemType() {
    if (!this.typeName || this.typeName.length < this.minLength || !this.typeBackColor) {
      return;
    }
    const itemType: ItemType = {
      TypeId: Guid.create(),
      TypeName: this.typeName,
      TypeBackColor: this.typeBackColor.toUpperCase(),
    };
    this.store.dispatch(AdminActions.addItemType({itemType}));
    this.onCancel();
  }

  onSelectColor(color: string) {
    this.typeBackColor = color.toUpperCase();
  }

  onChangeItemTypeName(text: string, itemType: ItemType) {
    const updatedItemType: ItemType = {
      ...itemType,
      TypeName: text,
    };
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.onCancel();
  }

  onChangeItemBackgroundColor(color: string, itemType: ItemType) {
    const updatedItemType: ItemType = {
      ...itemType,
      TypeBackColor: color.toUpperCase(),
    };
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.onCancel();
  }

  onDeleteItemType(itemType: ItemType) {
    this.store.dispatch(AdminActions.setCurrentItemType({itemType}));
    const dialogRef = this.dialog.open(DeleteItemTypeComponent, {
      width: 'auto',
      // class:
      data: itemType,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(AdminActions.deleteItemType({itemType}));
      }
      this.store.dispatch(AdminActions.setCurrentItemType({itemType: undefined}));
      this.onCancel();
    });
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.createMode = false;
  }

  onManageMappings(itemType: ItemType) {
    this.store.dispatch(AdminActions.setCurrentItemType({itemType}));
    const dialogRef = this.dialog.open(ItemTypeAttributeGroupMappingsComponent, {
      width: 'auto',
      // class:
      data: itemType,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(AdminActions.setCurrentItemType({itemType: undefined}));
      this.onCancel();
    });
  }
}
