import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { FullAttribute } from 'src/app/shared/objects/full-attribute.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';

@Component({
  selector: 'app-display-item-attributes',
  templateUrl: './display-item-attributes.component.html',
  styleUrls: ['./display-item-attributes.component.scss']
})
export class DisplayItemAttributesComponent implements OnInit {
  @Input() attributes: FullAttribute[];

  showAllAttributeTypes = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get attributeTypes() {
    return this.store.select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType);
  }

  getAttributeValue(attributeType: AttributeType) {
    const attribute = this.attributes.find(a => a.typeId === attributeType.TypeId);
    return attribute ? attribute.value : '';
  }

}
