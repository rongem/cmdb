import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile, Subscription, switchMap, take, tap, withLatestFrom } from 'rxjs';
import {
  AttributeType,
  ConfigurationItem,
  ConnectionRule,
  EditActions,
  ErrorActions,
  FullConfigurationItem,
  MetaDataSelectors,
  ReadFunctions,
  ValidatorService
} from 'backend-access';

import { ItemSelectors } from '../../shared/store/store.api';


@Component({
  selector: 'app-copy-item',
  templateUrl: './copy-item.component.html',
  styleUrls: ['./copy-item.component.scss']
})
export class CopyItemComponent implements OnInit, OnDestroy {
  item = new FullConfigurationItem();
  itemForm: FormGroup = new FormGroup({});
  formReady = false;
  working = false;
  error = false;
  errorMessage: string;
  private errorSubscription: Subscription;
  private itemId: string;
  private attributeTypes: AttributeType[];
  private connectionRules: ConnectionRule[];
  private ruleItemMap = new Map<string, Observable<ConfigurationItem[]>>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store,
              private actions$: Actions,
              private validator: ValidatorService,
              private http: HttpClient) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(params => {
        this.itemId = params.id;
      }),
      switchMap(() => this.configurationItem),
      skipWhile(configurationItem => !configurationItem || configurationItem.id !== this.itemId),
      take(1),
      withLatestFrom(
        this.store.select(MetaDataSelectors.selectAttributeTypes),
        this.store.select(MetaDataSelectors.selectConnectionRules),
      )
    ).subscribe(([item, attributeTypes, connectionRules]) => {
      this.attributeTypes = attributeTypes;
      this.connectionRules = connectionRules;
      this.createForm(item);
    });
    // wait for new item to be created and route to edit
    this.actions$.pipe(
      ofType(EditActions.storeFullConfigurationItem),
      take(1),
      map(value => value.configurationItem.id),
    ).subscribe(id => {
      this.router.navigate(['display', 'configuration-item', id, 'edit']);
    });
    // error handling if item creation fails
    this.errorSubscription = this.actions$.pipe(
      ofType(ErrorActions.error),
    ).subscribe(error => {
      this.error = true;
      this.errorMessage = error.error.message ?? error.error;
      this.working = false;
    });
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }

  getControl(name: string, element: string | number) {
    return (this.itemForm.controls[name] as FormArray).controls[element];
  }

  // cache items that are free to connect
  getConnectableItems(ruleId: string) {
    if (ruleId && !this.ruleItemMap.has(ruleId)) {
      this.ruleItemMap.set(ruleId, ReadFunctions.connectableItemsForRule(this.http, ruleId));
    }
    return this.ruleItemMap.get(ruleId);
  }

  getConnectionType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(typeId));
  }

  validateConnectableItem: AsyncValidatorFn = (c: AbstractControl) => this.getConnectableItems(c.value.ruleId).pipe(
      map(items => items.findIndex(i => i.id === c.value.targetId) === -1 ? {targetItemNotAvailableError: true} : null),
    );

  validateAttributeValue: ValidatorFn = (c: AbstractControl) => {
    const attributeType = this.attributeTypes.find(a => a.id === c.value.typeId);
    if (!attributeType) {
      return null;
    }
    return new RegExp(attributeType.validationExpression).test(c.value.value) ? null : {attributeValidationExpressionMismatch: true};
  };

  validateConnectionDescription: ValidatorFn = (c: AbstractControl) => {
    const connectionRule = this.connectionRules.find(cr => cr.id === c.value.ruleId);
    if (!connectionRule) {
      return null;
    }
    return new RegExp(connectionRule.validationExpression).test(c.value.description) ? null : {connectionDescriptionValidationError: true};
  };

  getAttributeType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeType(typeId));
  }

  toggleFormArray(formArray: AbstractControl, value: boolean) {
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

  private createForm(item: FullConfigurationItem) {
    const attr: FormGroup[] = [];
    item.attributes.forEach(att => attr.push(new FormGroup({
      id: new FormControl(''),
      typeId: new FormControl(att.typeId),
      value: new FormControl(att.value, Validators.required),
    }, this.validateAttributeValue)));
    const conn: FormGroup[] = [];
    item.connectionsToLower.forEach(c => conn.push(new FormGroup({
      id: new FormControl(''),
      typeId: new FormControl(c.typeId),
      targetId: new FormControl(c.targetId),
      ruleId: new FormControl(c.ruleId),
      description: new FormControl(c.description),
    }, [Validators.required, this.validateConnectionDescription], [this.validateConnectableItem])));
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
    }, null, this.validator.validateNameAndType);
    this.formReady = true;
  }
}
