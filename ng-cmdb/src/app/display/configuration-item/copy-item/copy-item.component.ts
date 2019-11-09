import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subscription, of } from 'rxjs';
import { take, skipWhile, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as EditActions from 'src/app/display/store/edit.actions';
import * as MultiEditActions from 'src/app/display/store/multi-edit.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Guid } from 'src/app/shared/guid';
import { getUrl } from 'src/app/shared/store/functions';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { Connection } from 'src/app/shared/objects/connection.model';
import { ItemLink } from 'src/app/shared/objects/item-link.model';

@Component({
  selector: 'app-copy-item',
  templateUrl: './copy-item.component.html',
  styleUrls: ['./copy-item.component.scss']
})
export class CopyItemComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private errorSubscription: Subscription;
  item = new FullConfigurationItem();
  itemForm: FormGroup = new FormGroup({});
  working = false;
  error = false;
  errorMessage: string;
  private itemId: Guid;
  private ruleItemMap = new Map<Guid, Observable<ConfigurationItem[]>>();
  private textObjectPresentMap = new Map<string, Observable<boolean>>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private http: HttpClient) { }

  ngOnInit() {
    this.item.id = Guid.create();
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id as Guid;
      }
    });
    // wait for old item to copy and initialize form
    this.actions$.pipe(
      ofType(DisplayActions.setConfigurationItem),
      skipWhile(value => value.configurationItem.id !== this.itemId),
      take(1),
      map(value => value.configurationItem),
    ).subscribe(item => {
      const newItemId = Guid.create();
      const attr: FormGroup[] = [];
      item.attributes.forEach(att => attr.push(new FormGroup({
        AttributeId: new FormControl(Guid.create()),
        ItemId: new FormControl(newItemId),
        AttributeTypeId: new FormControl(att.typeId),
        AttributeValue: new FormControl(att.value, Validators.required),
      })));
      const conn: FormGroup[] = [];
      item.connectionsToLower.forEach(c => conn.push(new FormGroup({
        ConnId: new FormControl(Guid.create()),
        ConnUpperItem: new FormControl(newItemId),
        ConnType: new FormControl(c.typeId),
        ConnLowerItem: new FormControl(c.targetId),
        RuleId: new FormControl(c.ruleId),
        Description: new FormControl(c.description),
      }, Validators.required, this.validateConnectableItem.bind(this))));
      const link: FormGroup[] = [];
      item.links.forEach(l => link.push(new FormGroup({
        LinkId: new FormControl(Guid.create()),
        ItemId: new FormControl(newItemId),
        LinkURI: new FormControl(l.uri, Validators.required),
        LinkDescription: new FormControl(l.description, Validators.required),
      })));
      this.itemForm = new FormGroup({
        item: new FormGroup({
          ItemId: new FormControl(newItemId),
          ItemType: new FormControl(item.typeId),
          ItemName: new FormControl('', Validators.required),
        }, [], this.validateNameAndType.bind(this)),
        attributes: new FormArray(attr),
        connectionsToLower: new FormArray(conn),
        links: new FormArray(link),
      });
      // wait for new item to be created, copy properties and route to edit
      this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
        skipWhile(value => value.configurationItem.id === this.itemId),
        take(1),
        map(value => value.configurationItem.id),
      ).subscribe(id => {
        if (this.itemForm.get('attributes').enabled) {
          this.itemForm.value.attributes.forEach((itemAttribute: ItemAttribute) => {
            this.store.dispatch(MultiEditActions.createItemAttribute({itemAttribute}));
          });
        }
        if (this.itemForm.get('connectionsToLower').enabled) {
          this.itemForm.value.connectionsToLower.forEach((connection: Connection) => {
            this.store.dispatch(MultiEditActions.createConnection({connection}));
          });
        }
        if (this.itemForm.get('links').enabled) {
          this.itemForm.value.links.forEach((itemLink: ItemLink) => {
            this.store.dispatch(MultiEditActions.createLink({itemLink}));
          });
        }
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: id}));
        this.router.navigate(['display', 'configuration-item', id, 'edit']);
      });
      // error handling if item creation fails
      this.errorSubscription = this.actions$.pipe(
        ofType(MetaDataActions.error),
       ).subscribe(error => {
          if (error.error.error.Message.toLowerCase().startsWith('cannot insert duplicate key row')) {
            this.error = true;
            this.errorMessage = 'Object with this name already exists.';
          }
          this.working = false;
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.pipe(select(fromSelectDisplay.selectDisplayConfigurationItem));
  }

  // cache items that are free to connect
  getConnectableItems(ruleId: Guid) {
    if (!this.ruleItemMap.has(ruleId)) {
      this.ruleItemMap.set(ruleId, this.http.get<ConfigurationItem[]>(getUrl('ConfigurationItems/Connectable/' + ruleId)));
    }
    return this.ruleItemMap.get(ruleId);
  }

  validateConnectableItem(c: FormGroup) {
    return this.getConnectableItems(c.value.RuleId).pipe(
      map(items => items.findIndex(i => i.ItemId === c.value.ConnLowerItem) === -1 ? 'target item not available' : null),
    );
  }

  // cache queries for items of that type and name
  getExistingObjects(name: string, typeId: Guid) {
    if (!this.textObjectPresentMap.has(name)) {
      this.textObjectPresentMap.set(name,
        this.http.get<ConfigurationItem>(getUrl('ConfigurationItem/type/' + typeId + '/name/' + name)
        ).pipe(map(ci => !!ci))
      );
    }
    return this.textObjectPresentMap.get(name);
  }

  validateNameAndType(c: FormGroup) {
    return this.getExistingObjects(c.value.ItemName, c.value.ItemType).pipe(
      map(value => value === true ? 'item with this name already exists' : null));
  }

  getAttributeType(typeId: Guid) {
    return this.store.pipe(select(fromSelectMetaData.selectSingleAttributeType, typeId));
  }

  toggleFormArray(formArray: FormArray, value: boolean) {
    if (value === true) {
      formArray.enable();
    } else {
      formArray.disable();
    }
  }

  toggleFormControl(formControl: FormControl, value: boolean) {
    if (value === true) {
      formControl.enable();
    } else {
      formControl.disable();
    }
  }

  onSubmit() {
    this.working = true;
    const configurationItem = this.itemForm.value.item as ConfigurationItem;
    this.store.dispatch(EditActions.createConfigurationItem({configurationItem}));
  }
}
