import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guid } from 'src/app/shared/guid';
import { Store, select } from '@ngrx/store';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as AdminActions from '../store/admin.actions';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AdminService } from 'src/app/admin/admin.service';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { DeleteAttributeTypeComponent } from './delete-attribute-type/delete-attribute-type.component';

@Component({
  selector: 'app-attribute-types',
  templateUrl: './attribute-types.component.html',
  styleUrls: ['./attribute-types.component.scss']
})
export class AttributeTypesComponent implements OnInit {
  readonly minLength = 4;
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  newTypeName: string;
  attributeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              private adminService: AdminService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  getAttributesForType(attributeType: AttributeType) {
    return this.adminService.getAttributesForAttributeType(attributeType).pipe(
      map((attributes: ItemAttribute[]) => attributes.length)
    ).toPromise();
  }

  onCreate() {
    this.activeType = undefined;
    this.attributeGroup = undefined;
    this.newTypeName = '';
    this.createMode = true;
  }

  onSetType(attributeType: AttributeType) {
    this.activeType = attributeType.TypeId;
    this.attributeGroup = undefined;
    this.createMode = false;
  }

  onSetAttributeGroup(attributeType: AttributeType) {
    this.activeType = attributeType.TypeId;
    this.attributeGroup = attributeType.AttributeGroup;
    this.createMode = false;
  }

  onCancel() {
    this.activeType = undefined;
    this.attributeGroup = undefined;
    this.createMode = false;
  }

  onCreateAttributeType() {
    if (!this.newTypeName || this.newTypeName.length < this.minLength || this.attributeGroup === undefined) {
      return;
    }
    const attributeType = new AttributeType();
    attributeType.TypeId = Guid.create();
    attributeType.TypeName = this.newTypeName;
    attributeType.AttributeGroup = this.attributeGroup;
    this.store.dispatch(AdminActions.addAttributeType({attributeType}));
    this.onCancel();
  }

  onChangeAttributeTypeName(name: string, attributeType: AttributeType) {
    const updatedAttributeType = {
      ...attributeType,
      TypeName: name,
    };
    this.store.dispatch(AdminActions.updateAttributeType({attributeType: updatedAttributeType}));
    this.onCancel();
  }

  onChangeAttributeGroup(attributeType: AttributeType) {
    const updatedAttributeType = {
      ...attributeType,
      AttributeGroup: this.attributeGroup,
    };
    this.store.dispatch(AdminActions.updateAttributeType({attributeType: updatedAttributeType}));
    this.onCancel();
  }

  onDeleteAttributeType(attributeType: AttributeType) {
    const dialogRef = this.dialog.open(DeleteAttributeTypeComponent, {
      width: 'auto',
      data: attributeType,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(AdminActions.deleteAttributeType({attributeType}));
      }
      this.onCancel();
    });
  }

  getAttributeGroup(groupId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleAttributeGroup, groupId);
  }

}
