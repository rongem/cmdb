import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { FullConfigurationItem, AttributeType, EditActions, ConfigurationItem } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectDisplay from '../../store/display.selectors';

@Component({
  selector: 'app-edit-item-attributes',
  templateUrl: './edit-item-attributes.component.html',
  styleUrls: ['./edit-item-attributes.component.scss']
})
export class EditItemAttributesComponent implements OnInit {
  itemId: string;
  editedAttributeType: string = undefined;
  private item: FullConfigurationItem;

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
    const configurationItem = ConfigurationItem.copyItem(this.item);
    const attributeToEdit = configurationItem.attributes.find(a => a.typeId === this.editedAttributeType);
    if (attributeToEdit) {
      attributeToEdit.value = text;
    } else {
      configurationItem.attributes.push({
        typeId: this.editedAttributeType,
        value: text,
      });
    }
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
    this.editedAttributeType = undefined;
  }

  onDeleteAttribute(attributeTypeId: string) {
    const configurationItem = ConfigurationItem.copyItem(this.item);
    const attributeIndex = configurationItem.attributes.findIndex(a => a.typeId === attributeTypeId);
    configurationItem.attributes.splice(attributeIndex, 1);
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
  }
}
