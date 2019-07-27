import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { DeleteItemTypeComponent } from './delete-item-type/delete-item-type.component';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.scss']
})
export class ItemTypesComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  typeName: string;
  attributeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.createMode = true;
  }

  onSetType(itemType: ItemType) {
    this.activeType = itemType.TypeId;
    this.typeName = itemType.TypeName;
    this.createMode = false;
  }

  onChangeItemTypeName(text: string, itemType: ItemType) {
    const updatedItemType: ItemType = {
      ...itemType,
      TypeName: text,
    };
    this.store.dispatch(new MetaDataActions.UpdateItemType(updatedItemType));
    this.onCancel();
  }

  onChangeItemBackgroundColor(color: string, itemType: ItemType) {
    const updatedItemType: ItemType = {
      ...itemType,
      TypeBackColor: color,
    };
    this.store.dispatch(new MetaDataActions.UpdateItemType(updatedItemType));
    this.onCancel();
  }

  onDeleteItemType(itemType: ItemType) {
    const dialogRef = this.dialog.open(DeleteItemTypeComponent, {
      width: 'auto',
      // class:
      data: itemType,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(new MetaDataActions.DeleteItemType(itemType));
      }
      this.onCancel();
    });
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.createMode = false;
  }

}
