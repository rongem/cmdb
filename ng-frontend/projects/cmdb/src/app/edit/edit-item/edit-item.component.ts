import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, skipWhile, Subscription, withLatestFrom } from 'rxjs';
import {
  ConfigurationItem,
  EditActions,
  FullConfigurationItem,
  MetaDataSelectors,
  ReadActions,
  ValidatorService,
} from 'backend-access';

import { ItemSelectors } from '../../shared/store/store.api';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
  deleteRequest = false;
  private item: FullConfigurationItem;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store, private fb: UntypedFormBuilder, private router: Router, private actions$: Actions, private val: ValidatorService) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get userName() {
    return this.store.select(MetaDataSelectors.selectUserName);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get attributes() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      map(value => value?.attributes ?? []),
    );
  }

  get attributeTypes() {
    return this.store.select(ItemSelectors.attributeTypesForCurrentDisplayItemType);
  }

  get connectionTypes() {
    return this.store.select(ItemSelectors.availableConnectionTypeGroupsToLower);
  }

  get userIsResponsible() {
    return this.store.select(ItemSelectors.userIsResponsible);
  }

  get links() {
    return this.form.get('links') as UntypedFormArray;
  }

  ngOnInit() {
    this.subscriptions.push(this.configurationItem.pipe(
      withLatestFrom(this.itemReady, this.attributeTypes),
      skipWhile(([, ready, ]) => !ready),
    ).subscribe(([item, ready, attributeTypes]) => {
      if (!ready) {
        return;
      }
      if (!item) {
        this.navigateAway();
        return;
      }
      this.item = item;
      this.form = this.fb.group({
        name: this.fb.control(item.name, [Validators.required, this.val.validateTrimmed]),
        attributes: this.fb.array(attributeTypes.map(attributeType => this.fb.group({
          typeId: this.fb.control(attributeType.id),
          value: this.fb.control(
            item.attributes.find(a => a.typeId === attributeType.id)?.value ?? '',
            [this.val.validateTrimmed, this.val.validateMatchesRegex(attributeType.validationExpression)]
          ),
        }))),
        links: this.fb.array(item.links.map(link => this.fb.group({
          uri: this.fb.control(link.uri, [Validators.required, this.val.validateTrimmed, this.val.validatUrl]),
          description: this.fb.control(link.description, [Validators.required, this.val.validateTrimmed]),
        })))
      });
    }));
    this.subscriptions.push(this.actions$.pipe(ofType(ReadActions.clearConfigurationItem)).subscribe(() => this.navigateAway()));
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.item.id}));
  }

  onSave() {
    const configurationItem = ConfigurationItem.copyItem(this.item);
    const updatedItem = this.form.value as ConfigurationItem;
    let changed = false;
    if (configurationItem.name !== updatedItem.name) {
      configurationItem.name = updatedItem.name;
      changed = true;
    }
    if (this.form.get('attributes').dirty) {
      updatedItem.attributes.forEach(updatedAttribute => {
        const attribute = configurationItem.attributes.find(att => att.typeId === updatedAttribute.typeId);
        if (attribute && !!updatedAttribute.value) {
          if (attribute.value !== updatedAttribute.value) {
            attribute.value = updatedAttribute.value;
            changed = true;
          }
        } else if (attribute && !updatedAttribute.value) {
          configurationItem.attributes.splice(configurationItem.attributes.indexOf(attribute), 1);
          changed = true;
        } else if (!attribute && !!updatedAttribute.value) {
          configurationItem.attributes.push(updatedAttribute);
          changed = true;
        }
      });
    }
    if (this.form.get('links').dirty) {
      configurationItem.links = updatedItem.links;
      changed = true;
    }
    if (!changed) {
      this.form.markAsPristine();
      return;
    }
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
  }

  onDeleteItem() {
    this.store.dispatch(EditActions.deleteConfigurationItem({itemId: this.item.id}));
  }

  onDeleteLink(index: number) {
    this.links.removeAt(index);
    this.links.markAsDirty();
  }

  onAddLink() {
    this.links.push(this.fb.group({
      uri: this.fb.control('https://', [Validators.required, this.val.validateTrimmed, this.val.validatUrl]),
      description: this.fb.control('', [Validators.required, this.val.validateTrimmed]),
    }));
  }

  onAbandonResponsibility() {
    this.store.dispatch(EditActions.abandonResponsibility({itemId: this.item.id}));
  }

  private navigateAway() {
    this.router.navigate(['display']);
  }

}
