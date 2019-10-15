import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  editName = false;
  private itemId: Guid;
  activeTab = 'attributes';
  private item: FullConfigurationItem;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
  }

  ngOnDestroy() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
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
    return this.store.pipe(select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType));
  }

  get connectionTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectAvailableConnectionTypeGroupsToLower));
  }

  get userIsResponsible() {
    return this.store.pipe(select(fromSelectDisplay.selectUserIsResponsible));
  }

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.itemId}));
  }

  onChangeItemName(text: string) {
    const configurationItem: ConfigurationItem = {
      ItemId: this.itemId,
      ItemName: text,
      ItemType: this.item.typeId,
      ItemVersion: this.item.version,
      ItemLastChange: this.item.lastChange,
    };
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
    this.editName = false;
  }

}
