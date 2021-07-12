import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItemAttribute, AttributeType } from 'backend-access';
import { ItemSelectors } from '../shared/store/store.api';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  @Input() attributes: ItemAttribute[];

  showAllAttributeTypes = false;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  get attributeTypes() {
    return this.store.select(ItemSelectors.attributeTypesForCurrentDisplayItemType);
  }

  getAttributeValue(attributeType: AttributeType) {
    const attribute = this.attributes.find(a => a.typeId === attributeType.id);
    return attribute ? attribute.value : '';
  }

}
