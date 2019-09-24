import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';

@Component({
  selector: 'app-edit-item-attributes',
  templateUrl: './edit-item-attributes.component.html',
  styleUrls: ['./edit-item-attributes.component.scss']
})
export class EditItemAttributesComponent implements OnInit {
  itemId: Guid;
  private item: FullConfigurationItem;
  editedAttributeType: Guid = undefined;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => {
        this.itemId = item ? item.id : undefined;
        this.item = item;
      }),
    );
  }

  get attributes() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType));
  }

  getAttributeValue(attributeType: AttributeType) {
    return this.attributes.pipe(map(value => {
      const attribute = value.find(a => a.typeId === attributeType.TypeId);
      return attribute ? attribute.value : '';
    }));
  }

  onChangeAttributeValue(text: string) {
    const attributeToEdit = this.item.attributes.find(a => a.typeId === this.editedAttributeType);
    const itemAttribute = new ItemAttribute();
    itemAttribute.AttributeValue = text;
    itemAttribute.ItemId = this.item.id;
    itemAttribute.AttributeTypeId = this.editedAttributeType;
    if (attributeToEdit) { // existing item
      itemAttribute.AttributeId = attributeToEdit.id;
      itemAttribute.AttributeLastChange = attributeToEdit.lastChange;
      itemAttribute.AttributeVersion = attributeToEdit.version;
      this.store.dispatch(EditActions.updateItemAttribute({itemAttribute}));
    } else { // new item
      itemAttribute.AttributeId = Guid.create();
      this.store.dispatch(EditActions.createItemAttribute({itemAttribute}));
    }
    this.editedAttributeType = undefined;
  }

  onDeleteAttribute(attributeTypeId: Guid) {
    const attribute = this.item.attributes.find(a => a.typeId === attributeTypeId);
    const itemAttribute = new ItemAttribute();
    itemAttribute.AttributeId = attribute.id;
    itemAttribute.ItemId = this.item.id;
    this.store.dispatch(EditActions.deleteItemAttribute({itemAttribute}));
  }
}
