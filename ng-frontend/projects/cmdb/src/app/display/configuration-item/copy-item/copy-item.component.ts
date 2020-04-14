import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subscription, of } from 'rxjs';
import { take, skipWhile, map, tap, switchMap } from 'rxjs/operators';
import { FullConfigurationItem, ConfigurationItem, Guid, ItemAttribute, Connection, ItemLink, Functions, StoreConstants,
  ReadActions, EditActions, MultiEditActions, MetaDataSelectors, ErrorActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

@Component({
  selector: 'app-copy-item',
  templateUrl: './copy-item.component.html',
  styleUrls: ['./copy-item.component.scss']
})
export class CopyItemComponent implements OnInit, OnDestroy {
  private errorSubscription: Subscription;
  item = new FullConfigurationItem();
  itemForm: FormGroup = new FormGroup({});
  formReady = false;
  working = false;
  error = false;
  errorMessage: string;
  private itemId: string;
  private ruleItemMap = new Map<string, Observable<ConfigurationItem[]>>();
  private textObjectPresentMap = new Map<string, Observable<boolean>>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private http: HttpClient) { }

  ngOnInit() {
    this.item.id = Guid.create().toString();
    this.route.params.pipe(
      tap(params => {
        if (!Guid.isGuid(params.id)) {
          this.router.navigate(['display']);
        }
        this.itemId = Guid.parse(params.id).toString();
      }),
      switchMap(() => this.configurationItem),
      skipWhile(configurationItem => !configurationItem || configurationItem.id !== this.itemId),
      take(1),
    ).subscribe(item => {
      this.createForm(item);
    });
    // wait for new item to be created, copy properties and route to edit
    this.actions$.pipe(
      ofType(ReadActions.setConfigurationItem),
      skipWhile(value => !this.formReady || value.configurationItem.id === this.itemId),
      take(1),
      map(value => value.configurationItem.id),
    ).subscribe(id => {
      this.router.navigate(['display', 'configuration-item', id, 'edit']);
    });
    // error handling if item creation fails
    this.errorSubscription = this.actions$.pipe(
      ofType(ErrorActions.error),
      ).subscribe(error => {
        if (error.error.error.Message.toLowerCase().startsWith('cannot insert duplicate key row')) {
          this.error = true;
          this.errorMessage = 'Object with this name already exists.';
        }
        this.working = false;
    });
  }

  private createForm(item: FullConfigurationItem) {
    const attr: FormGroup[] = [];
    item.attributes.forEach(att => attr.push(new FormGroup({
      id: new FormControl(Guid.create().toString()),
      typeId: new FormControl(att.typeId),
      value: new FormControl(att.value, Validators.required),
    })));
    const conn: FormGroup[] = [];
    item.connectionsToLower.forEach(c => conn.push(new FormGroup({
      id: new FormControl(Guid.create().toString()),
      typeId: new FormControl(c.typeId),
      targetId: new FormControl(c.targetId),
      ruleId: new FormControl(c.ruleId),
      description: new FormControl(c.description),
    }, Validators.required, this.validateConnectableItem.bind(this))));
    const link: FormGroup[] = [];
    item.links.forEach(l => link.push(new FormGroup({
      id: new FormControl(Guid.create().toString()),
      uri: new FormControl(l.uri, Validators.required),
      description: new FormControl(l.description, Validators.required),
    })));
    this.itemForm = new FormGroup({
      id: new FormControl(Guid.create().toString()),
      typeId: new FormControl(item.typeId),
      name: new FormControl('', Validators.required),
      attributes: new FormArray(attr),
      connectionsToLower: new FormArray(conn),
      links: new FormArray(link),
    }, [], this.validateNameAndType.bind(this));
    this.formReady = true;
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  get itemReady() {
    return this.store.pipe(
      select(fromSelectDisplay.getItemState),
      map(value => value.itemReady),
    );
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  getControl(name: string, element: string) {
    return (this.itemForm.controls[name] as FormArray).controls[element];
  }

  // cache items that are free to connect
  getConnectableItems(ruleId: string) {
    if (ruleId && !this.ruleItemMap.has(ruleId)) {
      this.ruleItemMap.set(ruleId, this.http.get<ConfigurationItem[]>(
        Functions.getUrl(StoreConstants.CONFIGURATIONITEMS + StoreConstants.CONNECTABLE.substr(1) + ruleId))
      );
    }
    return this.ruleItemMap.get(ruleId);
  }

  validateConnectableItem(c: FormGroup) {
    return this.getConnectableItems(c.value.ruleId).pipe(
      map(items => items.findIndex(i => i.id === c.value.targetId) === -1 ? 'target item not available' : null),
    );
  }

  // cache queries for items of that type and name
  getExistingObjects(name: string, typeId: Guid) {
    if (!name) {
      return of(false);
    }
    if (!this.textObjectPresentMap.has(name)) {
      this.textObjectPresentMap.set(name,
        this.http.get<ConfigurationItem>(Functions.getUrl(
          StoreConstants.CONFIGURATIONITEM + StoreConstants.TYPE + typeId + StoreConstants.NAME + name)
        ).pipe(map(ci => !!ci))
      );
    }
    return this.textObjectPresentMap.get(name);
  }

  validateNameAndType(c: FormGroup) {
    return this.getExistingObjects(c.value.name, c.value.typeId).pipe(
      map(value => value === true ? 'item with this name already exists' : null));
  }

  getAttributeType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeType, typeId);
  }

  toggleFormArray(formArray: FormArray, value: boolean) {
    if (formArray) {
      if (value === true) {
        formArray.enable();
      } else {
        formArray.disable();
      }
    }
  }

  toggleFormControl(formControl: FormControl, value: boolean) {
    if (formControl) {
      if (value === true) {
        formControl.enable();
      } else {
        formControl.disable();
      }
    }
  }

  onSubmit() {
    this.working = true;
    const item = this.itemForm.value as FullConfigurationItem;
    console.log(item);
    this.store.dispatch(EditActions.createFullConfigurationItem({item}));
  }
}
