import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, skipWhile, Subscription, take, withLatestFrom } from 'rxjs';
import { ConfigurationItem, EditActions, MetaDataSelectors, ReadActions, ValidatorService } from 'backend-access';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
  formReady = false;
  itemTypeId: string;
  private subscription: Subscription;

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store,
              private validator: ValidatorService,
              private fb: UntypedFormBuilder) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get itemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId));
  }

  get metaDataReady() {
    return this.store.select(MetaDataSelectors.selectDataValid);
  }

  get attributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.itemTypeId));
  }

  get attributes() {
    return this.form.get('attributes') as UntypedFormArray;
  }

  get links() {
    return this.form.get('links') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      typeId: this.fb.control('', Validators.required),
    });
    this.store.select(MetaDataSelectors.selectItemTypes).pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectDataValid)),
      skipWhile(([, valid]) => !valid),
      take(1),
    ).subscribe(([itemTypes, ]) => {
      if (itemTypes.length === 0) {
        this.router.navigate(['display']);
      }
    });
    this.store.dispatch(ReadActions.clearConfigurationItem({ success: true }));
    this.actions$.pipe(
      ofType(ReadActions.setConfigurationItem),
      take(1),
      map(action => action.configurationItem.id)
    ).subscribe(id => this.router.navigate(['edit', 'configuration-item', id]));
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  setItemType() {
    this.itemTypeId = this.form.value.typeId;
    this.attributeTypes.pipe(take(1)).subscribe(attributeTypes => {
      this.form = this.fb.group({
        name: this.fb.control('', [Validators.required, this.validator.validateTrimmed]),
        typeId: this.fb.control(this.itemTypeId),
        attributes: this.fb.array(attributeTypes.map(at => this.fb.group({
          typeId: this.fb.control(at.id),
          value: this.fb.control('', [this.validator.validateTrimmed, this.validator.validateMatchesRegex(at.validationExpression)]),
        }))),
        links: this.fb.array([]),
      }, { asyncValidators: [this.validator.validateNameAndType] });
    });
  }

  onAddLink() {
    this.links.push(this.fb.group({
      uri: this.fb.control('https://', [Validators.required, this.validator.validateTrimmed, this.validator.validatUrl]),
      description: this.fb.control('', [Validators.required, this.validator.validateTrimmed]),
    }));
  }

  onDeleteLink(index: number) {
    this.links.removeAt(index);
  }

  onSubmit() {
    this.attributes.controls.forEach(c => {
      if (!c.value.value) {
        c.disable();
      }
    });
    this.store.dispatch(EditActions.createConfigurationItem({configurationItem: this.form.value as ConfigurationItem}));
  }

}
