import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { FullConfigurationItem, ConfigurationItem, EditActions } from 'backend-access';
import { DisplaySelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  editName = false;
  activeTab = 'attributes';
  private item: FullConfigurationItem;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  get itemReady() {
    return this.store.select(DisplaySelectors.getItemState).pipe(
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.select(DisplaySelectors.selectDisplayConfigurationItem).pipe(
      tap(ci => this.item = ci),
    );
  }

  get attributes() {
    return this.store.select(DisplaySelectors.selectDisplayConfigurationItem).pipe(
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.select(DisplaySelectors.selectAttributeTypesForCurrentDisplayItemType);
  }

  get connectionTypes() {
    return this.store.select(DisplaySelectors.selectAvailableConnectionTypeGroupsToLower);
  }

  get userIsResponsible() {
    return this.store.select(DisplaySelectors.selectUserIsResponsible);
  }

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.item.id}));
  }

  onChangeItemName(text: string) {
    const configurationItem = ConfigurationItem.copyItem(this.item);
    configurationItem.name = text;
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
    this.editName = false;
  }

}
