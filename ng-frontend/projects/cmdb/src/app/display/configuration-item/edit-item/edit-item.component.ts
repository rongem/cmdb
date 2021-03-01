import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { FullConfigurationItem, ConfigurationItem, EditActions } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectDisplay from '../../store/display.selectors';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  editName = false;
  activeTab = 'attributes';
  private item: FullConfigurationItem;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem).pipe(
      tap(ci => this.item = ci),
    );
  }

  get attributes() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType);
  }

  get connectionTypes() {
    return this.store.select(fromSelectDisplay.selectAvailableConnectionTypeGroupsToLower);
  }

  get userIsResponsible() {
    return this.store.select(fromSelectDisplay.selectUserIsResponsible);
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
