import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';

@Component({
  selector: 'app-attribute-types',
  templateUrl: './attribute-types.component.html',
  styleUrls: ['./attribute-types.component.scss']
})
export class AttributeTypesComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  typeName: string;
  attributeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  getAttributesForType(attributeType: AttributeType) {
    
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.attributeGroup = undefined;
    this.createMode = true;
  }

  onSetType(attributeType: AttributeType) {
    this.activeType = attributeType.TypeId;
    this.typeName = attributeType.TypeName;
    this.attributeGroup = undefined;
    this.createMode = false;
  }

  onSetAttributeGroup(attributeType: AttributeType) {
    this.activeType = attributeType.TypeId;
    this.typeName = undefined;
    this.attributeGroup = attributeType.AttributeGroup;
    this.createMode = false;
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.attributeGroup = undefined;
    this.createMode = false;
  }

  onChangeAttributeTypeName(attributeType: AttributeType) {}

  onChangeAttributeGroup(attributeType: AttributeType) {}

  onDeleteAttributeType(attributeType: AttributeType) {}

}
