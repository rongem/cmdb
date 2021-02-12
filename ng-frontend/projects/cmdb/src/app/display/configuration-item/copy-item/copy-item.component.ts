import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { take, skipWhile, map, tap, switchMap } from 'rxjs/operators';
import { FullConfigurationItem, ConfigurationItem, ReadFunctions,
  ReadActions, EditActions, MetaDataSelectors, ErrorActions, ValidatorService } from 'backend-access';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions,
              private validator: ValidatorService,
              private http: HttpClient) { }

  ngOnInit() {
    this.route.params.pipe(
      tap(params => {
        this.itemId = params.id;
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
      id: new FormControl(''),
      typeId: new FormControl(att.typeId),
      value: new FormControl(att.value, Validators.required),
    })));
    const conn: FormGroup[] = [];
    item.connectionsToLower.forEach(c => conn.push(new FormGroup({
      id: new FormControl(''),
      typeId: new FormControl(c.typeId),
      targetId: new FormControl(c.targetId),
      ruleId: new FormControl(c.ruleId),
      description: new FormControl(c.description),
    }, Validators.required, this.validateConnectableItem)));
    const link: FormGroup[] = [];
    item.links.forEach(l => link.push(new FormGroup({
      id: new FormControl(''),
      uri: new FormControl(l.uri, Validators.required),
      description: new FormControl(l.description, Validators.required),
    })));
    this.itemForm = new FormGroup({
      id: new FormControl(''),
      typeId: new FormControl(item.typeId),
      name: new FormControl('', Validators.required),
      attributes: new FormArray(attr),
      connectionsToLower: new FormArray(conn),
      links: new FormArray(link),
    }, [], this.validator.validateNameAndType);
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
      this.ruleItemMap.set(ruleId, ReadFunctions.connectableItemsForRule(this.http, ruleId));
    }
    return this.ruleItemMap.get(ruleId);
  }

  validateConnectableItem: AsyncValidatorFn = (c: FormGroup) => {
    return this.getConnectableItems(c.value.ruleId).pipe(
      map(items => items.findIndex(i => i.id === c.value.targetId) === -1 ? {targetItemNotAvailableError: true} : null),
    );
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
    this.store.dispatch(EditActions.createFullConfigurationItem({item}));
  }
}
