import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { FullAttribute, AttributeType } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

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
    const attribute = this.attributes.find(a => a.typeId === attributeType.id);
    return attribute ? attribute.value : '';
  }

}
