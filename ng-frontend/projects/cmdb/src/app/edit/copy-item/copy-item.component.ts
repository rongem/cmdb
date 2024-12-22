import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
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
    styleUrls: ['./copy-item.component.scss'],
    standalone: false
})
export class CopyItemComponent implements OnInit, OnDestroy {
  item = new FullConfigurationItem();
  itemForm: UntypedFormGroup = new UntypedFormGroup({});
  formReady = false;
  working = false;
  error = false;
  errorMessage: string;
  private updatingForm = false;
  private formSubscription: Subscription;
  private errorSubscription: Subscription;
  private itemId: string;
  private attributeTypes: AttributeType[];
  private connectionRules: ConnectionRule[];
  private ruleItemMap = new Map<string, Observable<ConfigurationItem[]>>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store,
              private actions$: Actions,
              private fb: UntypedFormBuilder,
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
      this.router.navigate(['edit', 'configuration-item', id]);
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
    this.errorSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
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

  onSubmit() {
    this.working = true;
    const item = FullConfigurationItem.copyItem(this.itemForm.value as FullConfigurationItem);
    this.store.dispatch(EditActions.createFullConfigurationItem({item}));
  }

  private createForm(item: FullConfigurationItem) {
    this.itemForm = this.fb.group({
      id: this.fb.control(''),
      typeId: this.fb.control(item.typeId),
      name: this.fb.control('', Validators.required),
      attributesEnabled: this.fb.control(!!item.attributes?.length),
      attributes: this.fb.array(item.attributes.map(a => this.fb.group({
        enabled: this.fb.control(true),
        typeId: this.fb.control(a.typeId),
        value: this.fb.control(a.value, Validators.required),
      }))),
      connectionsToLowerEnabled: this.fb.control(!!item.connectionsToLower?.length),
      connectionsToLower: this.fb.array(item.connectionsToLower.map(c => this.fb.group({
        enabled: this.fb.control(true),
        typeId: this.fb.control(c.typeId),
        targetId: this.fb.control(c.targetId),
        ruleId: this.fb.control(c.ruleId),
        description: this.fb.control(c.description),
      }))),
      linksEnabled: this.fb.control(!!item.links?.length),
      links: this.fb.array(item.links.map(l => this.fb.group({
        enabled: this.fb.control(true),
        uri: this.fb.control(l.uri, Validators.required),
        description: this.fb.control(l.description, Validators.required),
      }))),
    }, {
      asyncValidators: [this.validator.validateNameAndType]
    });
    this.formSubscription = this.itemForm.valueChanges.subscribe(value => {
      if (this.updatingForm) {
        return;
      }
      this.updatingForm = true;
      const attributes = this.itemForm.get('attributes') as UntypedFormArray;
      if (value.attributesEnabled && attributes.disabled) {
        attributes.enable();
      } else if (!value.attributesEnabled && attributes.enabled) {
        attributes.disable();
      } else {
        attributes.controls.forEach(c => {
          const v = c.get('value');
          if (c.value.enabled && v.disabled) {
            c.enable();
          } else if (!c.value.enabled && v.enabled) {
            c.disable();
            c.get('enabled').enable();
          }
        });
      }
      const connectionsToLower = this.itemForm.get('connectionsToLower') as UntypedFormArray;
      if (value.connectionsToLowerEnabled && connectionsToLower.disabled) {
        connectionsToLower.enable();
      } else if (!value.connectionsToLowerEnabled && connectionsToLower.enabled) {
        connectionsToLower.disable();
      } else {
        connectionsToLower.controls.forEach(c => {
          const d = c.get('description');
          if (c.value.enabled && d.disabled) {
            c.enable();
          } else if (!c.value.enabled && d.enabled) {
            c.disable();
            c.get('enabled').enable();
          }
        });
      }
      const links = this.itemForm.get('links') as UntypedFormArray;
      if (value.linksEnabled && links.disabled) {
        links.enable();
      } else if (!value.linksEnabled && links.disabled) {
        links.disable();
      } else {
        links.controls.forEach(c => {
          const u = c.get('uri');
          if (c.value.enabled && u.disabled) {
            c.enable();
          } else if (!c.value.enabled && u.enabled) {
            c.disable();
            c.get('enabled').enable();
          }
        });
      }
      this.updatingForm = false;
    });
    this.formReady = true;
  }
}
