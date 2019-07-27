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
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
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

  onChangeAttributeTypeName(text: string, attributeType: AttributeType) {}

  onChangeAttributeGroup(attributeType: AttributeType) {}

  onDeleteAttributeType(attributeType: AttributeType) {}

}
