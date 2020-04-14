import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { Guid, FullConfigurationItem, ItemAttribute, AttributeType, EditActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

@Component({
  selector: 'app-edit-item-attributes',
  templateUrl: './edit-item-attributes.component.html',
  styleUrls: ['./edit-item-attributes.component.scss']
})
export class EditItemAttributesComponent implements OnInit {
  itemId: string;
  private item: FullConfigurationItem;
  editedAttributeType: string = undefined;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get attributes() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => {
        this.itemId = item ? item.id : undefined;
        this.item = item;
      }),
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType);
  }

  getAttributeValue(attributeType: AttributeType) {
    return this.attributes.pipe(map(value => {
      const attribute = value.find(a => a.typeId === attributeType.id);
      return attribute ? attribute.value : '';
    }));
  }

  onChangeAttributeValue(text: string) {
    const attributeToEdit = this.item.attributes.find(a => a.typeId === this.editedAttributeType);
    const itemAttribute = new ItemAttribute();
    itemAttribute.value = text;
    itemAttribute.itemId = this.item.id;
    itemAttribute.typeId = this.editedAttributeType;
    if (attributeToEdit) { // existing item
      itemAttribute.id = attributeToEdit.id;
      itemAttribute.lastChange = attributeToEdit.lastChange;
      itemAttribute.version = attributeToEdit.version;
      this.store.dispatch(EditActions.updateItemAttribute({itemAttribute}));
    } else { // new item
      itemAttribute.id = Guid.create().toString();
      this.store.dispatch(EditActions.createItemAttribute({itemAttribute}));
    }
    this.editedAttributeType = undefined;
  }

  onDeleteAttribute(attributeTypeId: string) {
    const attribute = this.item.attributes.find(a => a.typeId === attributeTypeId);
    const itemAttribute = new ItemAttribute();
    itemAttribute.id = attribute.id;
    itemAttribute.itemId = this.item.id;
    this.store.dispatch(EditActions.deleteItemAttribute({itemAttribute}));
  }
}
