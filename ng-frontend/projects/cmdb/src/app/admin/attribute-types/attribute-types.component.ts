import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AttributeType, AdminActions, MetaDataSelectors } from 'backend-access';

import { DeleteAttributeTypeComponent } from './delete-attribute-type/delete-attribute-type.component';

@Component({
  selector: 'app-attribute-types',
  templateUrl: './attribute-types.component.html',
  styleUrls: ['./attribute-types.component.scss']
})
export class AttributeTypesComponent implements OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('groupInput') groupInput: ElementRef;
  @ViewChild('valInput') valInput: ElementRef;
  form: FormGroup;
  readonly minLength = 4;
  activeLine: number;
  newTypeName: string;
  attributeGroup: string;
  validationExpression: string;
  createMode = false;
  lastNameChange = -1;
  lastGroupChange = -1;
  lastValChange = -1;
  private activeType?: AttributeType;

  constructor(private store: Store,
              public dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
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
    return this.store.select(MetaDataSelectors.selectSingleAttributeGroup(groupId));
  }

  onCreate() {
    this.activeType = undefined;
    this.activeLine = -1;
    this.createForm();
    this.createMode = true;
  }

  onSetActiveLine(attributeType: AttributeType, index: number, activateColumn: number) {
    if (this.activeLine >= 0 || this.activeType) {
      console.log(this.activeType);
    }
    this.createForm(attributeType);
    this.activeType = attributeType;
    this.activeLine = index;
    this.createMode = false;
    setTimeout(() => this.getInput(activateColumn)?.focus(), 0);
  }

  onCancel() {
    this.activeType = undefined;
    this.activeLine = -1;
    this.createMode = false;
  }

  onChangeAttributeType() {
    if (this.form.invalid || this.form.pristine) {
      return;
    }
    const attributeType = this.form.value as AttributeType;
    if (!this.activeType || attributeType.id !== this.activeType.id) {
      this.onCancel();
      return;
    }
    // check if anything has changed
    if (attributeType.name === this.activeType.name && attributeType.attributeGroupId === this.activeType.attributeGroupId &&
      attributeType.validationExpression === this.activeType.validationExpression) {
        this.onCancel();
        return;
    }
    this.lastNameChange = (attributeType.name !== this.activeType.name) ? this.activeLine : -1;
    this.lastGroupChange = (attributeType.attributeGroupId !== this.activeType.attributeGroupId) ? this.activeLine : -1;
    this.lastValChange = (attributeType.validationExpression !== this.activeType.validationExpression) ? this.activeLine : -1;
    this.store.dispatch(AdminActions.updateAttributeType({attributeType}));
    this.onCancel();
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

  private createForm(attributeType?: AttributeType) {
    this.form = this.fb.group({
      id: this.fb.control(attributeType ? attributeType.id : ''),
      name: this.fb.control(attributeType ? attributeType.name : '', [Validators.required, Validators.minLength(this.minLength)]),
      attributeGroupId: this.fb.control(attributeType ? attributeType.attributeGroupId : '', [Validators.required]),
      validationExpression: this.fb.control(attributeType ? attributeType.validationExpression : '^.*$', [Validators.required, this.validRegex])
    });
  }

  private validRegex: ValidatorFn = (c: AbstractControl) => {
    const content = (c.value as string).trim();
    if (!content || !content.startsWith('^') || !content.endsWith('$')) {
      return {noFullLineRegexpError: true};
    }
    try {
      const regex = RegExp(c.value);
    } catch (e) {
      return e;
    }
    return null;
  };

  private getInput(num: number) {
    let elem: HTMLInputElement;
    switch(num) {
      case 1:
        elem = this.nameInput?.nativeElement;
        break;
      case 2:
        elem = this.groupInput?.nativeElement;
        break;
      case 3:
        elem = this.valInput?.nativeElement;
        break;
    }
    return elem;
  }

}
