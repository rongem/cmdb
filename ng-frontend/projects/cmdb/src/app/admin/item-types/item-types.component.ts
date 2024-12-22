import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItemType, AdminActions, MetaDataSelectors } from 'backend-access';

import * as LocalAdminActions from '../store/admin.actions';

import { ItemTypeAttributeGroupMappingsComponent } from './attribute-group-mappings/attribute-group-mappings.component';

@Component({
    selector: 'app-item-types',
    templateUrl: './item-types.component.html',
    styleUrls: ['./item-types.component.scss'],
    standalone: false
})
export class ItemTypesComponent implements OnInit {
  readonly minLength = 4;
  activeType: string;
  typeName: string;
  typeBackColor: string;
  attributeGroup: string;
  createMode = false;

  constructor(private store: Store) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  ngOnInit() {
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
      id: undefined,
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

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.createMode = false;
  }

}
