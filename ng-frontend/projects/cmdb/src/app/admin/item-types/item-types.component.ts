import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Guid, ItemType, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as LocalAdminActions from 'projects/cmdb/src/app/admin/store/admin.actions';

import { DeleteItemTypeComponent } from './delete-item-type/delete-item-type.component';
import { ItemTypeAttributeGroupMappingsComponent } from './attribute-group-mappings/attribute-group-mappings.component';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.scss']
})
export class ItemTypesComponent implements OnInit {
  readonly minLength = 4;
  activeType: string;
  typeName: string;
  typeBackColor: string;
  attributeGroup: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = '';
    this.typeBackColor = '#FFFFFF';
    this.createMode = true;
  }

  onSetType(itemType: ItemType) {
    this.activeType = itemType.id;
    this.typeName = itemType.name;
    this.createMode = false;
  }

  onCreateItemType() {
    if (!this.typeName || this.typeName.length < this.minLength || !this.typeBackColor) {
      return;
    }
    const itemType: ItemType = {
      id: Guid.create().toString(),
      name: this.typeName,
      backColor: this.typeBackColor.toUpperCase(),
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
      name: text,
    };
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.onCancel();
  }

  onChangeItemBackgroundColor(color: string, itemType: ItemType) {
    const updatedItemType: ItemType = {
      ...itemType,
      backColor: color.toUpperCase(),
    };
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.onCancel();
  }

  onDeleteItemType(itemType: ItemType) {
    this.store.dispatch(LocalAdminActions.setCurrentItemType({itemType}));
    const dialogRef = this.dialog.open(DeleteItemTypeComponent, {
      width: 'auto',
      // class:
      data: itemType,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(AdminActions.deleteItemType({itemType}));
      }
      this.store.dispatch(LocalAdminActions.setCurrentItemType({itemType: undefined}));
      this.onCancel();
    });
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.createMode = false;
  }

  onManageMappings(itemType: ItemType) {
    this.store.dispatch(LocalAdminActions.setCurrentItemType({itemType}));
    const dialogRef = this.dialog.open(ItemTypeAttributeGroupMappingsComponent, {
      width: 'auto',
      // class:
      data: itemType,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(LocalAdminActions.setCurrentItemType({itemType: undefined}));
      this.onCancel();
    });
  }
}
