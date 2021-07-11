import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItemAttribute, AttributeType } from 'backend-access';
import { ItemSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-display-item-attributes',
  templateUrl: './display-item-attributes.component.html',
  styleUrls: ['./display-item-attributes.component.scss']
})
export class DisplayItemAttributesComponent implements OnInit {
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
