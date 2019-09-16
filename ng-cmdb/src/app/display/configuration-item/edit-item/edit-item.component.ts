import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, tap, withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;
  editName = false;
  editedAttributeType: Guid = undefined;
  itemId: Guid;
  private item: FullConfigurationItem;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id as Guid;
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: this.itemId}));
      }
      this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        take(1),
        map(value => value.result.Success)
        ).subscribe((value) => {
          if (value === false || value === true) {
            this.router.navigate(['display', 'search']);
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
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
    return this.store.pipe(select(fromSelectDisplay.selectConnectionTypeGroupsToLower));
  }

  get userIsResponsible() {
    return this.store.pipe(select(fromSelectDisplay.selectUserIsResponsible));
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
