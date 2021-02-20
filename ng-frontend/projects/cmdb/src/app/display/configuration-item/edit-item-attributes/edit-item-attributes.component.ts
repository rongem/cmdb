import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { FullConfigurationItem, AttributeType, EditActions } from 'backend-access';

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
    if (attributeToEdit) {
      attributeToEdit.value = text;
    } else {
      this.item.attributes.push({
        itemId: this.itemId,
        typeId: this.editedAttributeType,
        value: text,
      });
    }
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem: this.item}));
    this.editedAttributeType = undefined;
  }

  onDeleteAttribute(attributeTypeId: string) {
    const attributeIndex = this.item.attributes.findIndex(a => a.typeId === attributeTypeId);
    this.item.attributes.splice(attributeIndex, 1);
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem: this.item}));
  }
}
