import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { map } from 'rxjs/operators';

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
              private metaData: MetaDataService) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  getAttributesForType(attributeType: AttributeType) {
    return this.metaData.getAttributesForAttributeType(attributeType).pipe(
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
    console.log(this.attributeGroup);
    if (!this.newTypeName || this.newTypeName.length < this.minLength || this.attributeGroup === undefined) {
      return;
    }
    const attributeType = new AttributeType();
    attributeType.TypeId = Guid.create();
    attributeType.TypeName = this.newTypeName;
    attributeType.AttributeGroup = this.attributeGroup;
    this.store.dispatch(new MetaDataActions.AddAttributeType(attributeType));
    this.onCancel();
  }

  onChangeAttributeTypeName(name: string, attributeType: AttributeType) {
    const updatedAttributeType = {
      ...attributeType,
      TypeName: name,
    };
    this.store.dispatch(new MetaDataActions.UpdateAttributeType(updatedAttributeType));
    this.onCancel();
  }

  onChangeAttributeGroup(attributeType: AttributeType) {
    const updatedAttributeType = {
      ...attributeType,
      AttributeGroup: this.attributeGroup,
    };
    this.store.dispatch(new MetaDataActions.UpdateAttributeType(updatedAttributeType));
    this.onCancel();
  }

  onDeleteAttributeType(attributeType: AttributeType) {
    this.store.dispatch(new MetaDataActions.DeleteAttributeType(attributeType));
    this.onCancel();
  }

}
