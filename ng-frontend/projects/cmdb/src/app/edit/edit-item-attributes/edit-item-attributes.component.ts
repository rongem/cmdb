import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { FullConfigurationItem, AttributeType, EditActions, ConfigurationItem } from 'backend-access';
import { ItemSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-edit-item-attributes',
  templateUrl: './edit-item-attributes.component.html',
  styleUrls: ['./edit-item-attributes.component.scss']
})
export class EditItemAttributesComponent implements OnInit {
  itemId: string;
  editedAttributeType: string = undefined;
  private item: FullConfigurationItem;

  constructor(private store: Store) { }

  get attributes() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      tap((item: FullConfigurationItem) => {
        this.itemId = item ? item.id : undefined;
        this.item = item;
      }),
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.select(ItemSelectors.attributeTypesForCurrentDisplayItemType);
  }

  ngOnInit() {
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
