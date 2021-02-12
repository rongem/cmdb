import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AttributeType, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

import { DeleteAttributeTypeComponent } from './delete-attribute-type/delete-attribute-type.component';

@Component({
  selector: 'app-attribute-types',
  templateUrl: './attribute-types.component.html',
  styleUrls: ['./attribute-types.component.scss']
})
export class AttributeTypesComponent implements OnInit {
  readonly minLength = 4;
  activeType: string;
  newTypeName: string;
  attributeGroup: string;
  validationExpression: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get attributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypes);
  }

  get attributeGroups() {
    return this.store.select(MetaDataSelectors.selectAttributeGroups);
  }

  get connectionTypes() {
    return this.store.select(MetaDataSelectors.selectConnectionTypes);
  }

  getAttributeGroup(groupId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeGroup, groupId);
  }

  onCreate() {
    this.activeType = undefined;
    this.attributeGroup = undefined;
    this.newTypeName = '';
    this.validationExpression = '^.*$';
    this.createMode = true;
  }

  onSetType(attributeType: AttributeType) {
    this.activeType = attributeType.id;
    this.attributeGroup = undefined;
    this.validationExpression = undefined;
    this.createMode = false;
  }

  onSetAttributeGroup(attributeType: AttributeType) {
    this.activeType = attributeType.id;
    this.attributeGroup = attributeType.attributeGroupId;
    this.validationExpression = undefined;
    this.createMode = false;
  }

  onSetValidationExpression(attributeType: AttributeType) {
    this.activeType = attributeType.id;
    this.attributeGroup = undefined;
    this.validationExpression = attributeType.validationExpression;
    this.createMode = false;
  }

  onCancel() {
    this.activeType = undefined;
    this.attributeGroup = undefined;
    this.validationExpression = undefined;
    this.createMode = false;
  }

  onCreateAttributeType() {
    if (!this.newTypeName || this.newTypeName.length < this.minLength || this.attributeGroup === undefined ||
      this.validationExpression.length < this.minLength) {
      return;
    }
    if (!this.validationExpression.startsWith('^') || !this.validationExpression.endsWith('$')) {
      return;
    }
    try {
      const regEx = new RegExp(this.validationExpression);
    } catch (e) {
      return;
    }
    const attributeType: AttributeType = {
      id: undefined,
      name: this.newTypeName,
      attributeGroupId: this.attributeGroup,
      validationExpression: this.validationExpression,
    };
    this.store.dispatch(AdminActions.addAttributeType({attributeType}));
    this.onCancel();
  }

  onChangeAttributeTypeName(name: string, attributeType: AttributeType) {
    const updatedAttributeType: AttributeType = {
      ...attributeType,
      name,
    };
    this.store.dispatch(AdminActions.updateAttributeType({attributeType: updatedAttributeType}));
    this.onCancel();
  }

  onChangeAttributeTypeValidationExpression(validationExpression: string, attributeType: AttributeType) {
    if (!validationExpression.startsWith('^') || !validationExpression.endsWith('$')) {
      return;
    }
    const updateAttributeType: AttributeType = {
      ...attributeType,
      validationExpression,
    };
    try {
      const regEx = new RegExp(validationExpression);
      this.store.dispatch(AdminActions.updateAttributeType({attributeType: updateAttributeType}));
      this.onCancel();
    } catch (e) {
      console.log(e);
    }
  }

  onChangeAttributeGroup(attributeType: AttributeType) {
    const updatedAttributeType: AttributeType = {
      ...attributeType,
      attributeGroupId: this.attributeGroup,
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
}
