import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
import { ItemLink } from 'src/app/shared/objects/item-link.model';
import { AddLinkComponent } from './add-link/add-link.component';
import { FullLink } from 'src/app/shared/objects/full-link.model';
import { FullConnection } from 'src/app/shared/objects/full-connection.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;
  editName = false;
  addLink = false;
  editedAttributeType: Guid = undefined;
  itemId: Guid;
  private item: FullConfigurationItem;
  displayedResponsibilityColumns = ['account', 'name', 'mail'];
  displayedLinkColumns = ['link', 'description', 'id'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              public dialog: MatDialog) { }

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
    this.route.fragment.subscribe((fragment: string) => {
      console.log(fragment);
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
    return this.store.pipe(select(fromSelectDisplay.selectConnectionTypesToLower));
  }

  get userIsResponsible() {
    return this.store.pipe(select(fromSelectDisplay.selectUserIsResponsible));
  }

  get userName() {
    return this.store.pipe(select(fromSelectMetaData.selectUserName));
  }

  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }

  getConnectionRules(typeId: Guid) {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionRuleIdsToLowerByType, typeId));
  }

  getTargetItemTypeByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetType;
    }
  }

  getTargetColorByRule(ruleId: Guid, connections: FullConnection[]) {
    if (connections && connections.length > 0) {
      return connections.filter(c => c.ruleId === ruleId)[0].targetColor;
    }
  }

  getConnectionsByRule(ruleId: Guid, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId);
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

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.itemId}));
  }

  onAbandonResponsibility() {
    this.store.dispatch(EditActions.abandonResponsibility({itemId: this.itemId}));
  }

  onDeleteResponsibility(userToken: string) {
    console.log(userToken);
  }

  onAddLink() {
    const dialogRef = this.dialog.open(AddLinkComponent, {
      width: 'auto',
      // class:
      data: this.itemId,
    });
    dialogRef.afterClosed().subscribe(itemLink => {
      if (itemLink instanceof ItemLink) {
        this.store.dispatch(EditActions.createLink({itemLink}));
      }
    });

  }

  onDeleteLink(linkId: Guid) {
    const itemLink = new ItemLink();
    itemLink.ItemId = this.itemId;
    itemLink.LinkId = linkId;
    this.store.dispatch(EditActions.deleteLink({itemLink}));
  }
}
