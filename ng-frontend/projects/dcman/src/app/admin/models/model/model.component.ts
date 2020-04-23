import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, withLatestFrom, skipWhile, take, switchMap } from 'rxjs/operators';
import { MetaDataSelectors, EditActions, Guid, AttributeType, FullConfigurationItem, ItemAttribute, FullAttribute } from 'backend-access';

import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';
import * as fromSelectAsset from '../../../shared/store/asset/asset.selectors';
import * as BasicsActions from '../../../shared/store/basics/basics.actions';

import { AppState } from '../../../shared/store/app.reducer';
import { selectRouterStateId } from '../../../shared/store/router/router.reducer';
import { Model } from '../../../shared/objects/model.model';
import { AppConfigService } from '../../../shared/app-config.service';
import { Mappings } from '../../../shared/objects/appsettings/mappings.model';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {
  form: FormGroup;
  createMode = false;
  private subscription: Subscription;
  itemTypeNames = Object.values(AppConfigService.objectModel.ConfigurationItemTypeNames).filter(n =>
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.BareMetalHypervisor &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Model &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Room &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.Server &&
    n !== AppConfigService.objectModel.ConfigurationItemTypeNames.SoftAppliance
  );

  private lowerRackMountableNames = Mappings.rackMountables.map(rm => rm.toLocaleLowerCase());
  private lowerEnclosureMountableNames = Mappings.enclosureMountables.map(rm => rm.toLocaleLowerCase());

  constructor(private store: Store<AppState>,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ready.pipe(
      skipWhile(ready => !ready),
      withLatestFrom(this.model),
      take(1),
    ).subscribe(([, model]) => {
      if (!model && !this.createMode) {
        this.router.navigate(['admin', 'models']);
      }
    });
    this.subscription = this.model.subscribe(model => {
      if (!model) {
        model = new Model();
        model.id = Guid.create().toString();
      }
      this.form = this.fb.group({
        id: this.fb.control(model.id),
        name: this.fb.control(model.name, [Validators.required]),
        manufacturer: this.fb.control(model.manufacturer, [Validators.required]),
        targetType: this.fb.control(model.targetType, [Validators.required]),
        height: this.fb.control(model.height),
        heightUnits: this.fb.control(model.heightUnits),
        width: this.fb.control(model.width),
      });
      this.setValidators(model.targetType);
      this.form.get('targetType').valueChanges.subscribe((value: string) => {
        this.setValidators(value);
      });
    });
  }

  private setValidators(value: string) {
    const height = this.form.get('height');
    const width = this.form.get('width');
    const heightUnits = this.form.get('heightUnits');
    if (this.lowerRackMountableNames.includes(value)) {
      heightUnits.setValidators([Validators.required, Validators.min(1)]);
    } else {
      heightUnits.setValidators(null);
    }
    if (this.lowerEnclosureMountableNames.includes(value)) {
      height.setValidators([Validators.required, Validators.min(1)]);
      width.setValidators([Validators.required, Validators.min(1)]);
    } else {
      height.setValidators(null);
      width.setValidators(null);
    }
    height.updateValueAndValidity();
    width.updateValueAndValidity();
    heightUnits.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get ready() {
    return this.store.select(fromSelectBasics.ready);
  }

  get model() {
    return this.store.pipe(
      select(selectRouterStateId),
      switchMap(id => this.store.select(fromSelectBasics.selectModel, id)),
    );
  }

  get modelCount() {
    return this.model.pipe(
      switchMap(model => this.store.select(fromSelectAsset.selectItemsByModel, model)),
      map(asset => asset.length),
    );
  }

  get rackMountables() {
    return Mappings.rackMountables;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    if (this.createMode) {
      const item = new FullConfigurationItem();
      item.id = this.form.value.id;
      item.name = this.form.value.name;
      item.attributes = [];
      this.store.pipe(
        select(MetaDataSelectors.selectSingleItemTypeByName, AppConfigService.objectModel.ConfigurationItemTypeNames.Model),
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        take(1),
      ).subscribe(([itemType, attributeTypes]) => {
        item.typeId = itemType.id;
        item.type = itemType.name;
        item.color = itemType.backColor;
        let attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Manufacturer);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.manufacturer));
        attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.TargetTypeName);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.targetType));
        if (this.form.value.height) {
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Height);
          item.attributes.push(this.createFullAttribute(attributeType, this.form.value.height));
        }
        if (this.form.value.width) {
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Width);
          item.attributes.push(this.createFullAttribute(attributeType, this.form.value.width));
        }
        if (this.form.value.heightUnits) {
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.HeightUnits);
          item.attributes.push(this.createFullAttribute(attributeType, this.form.value.heightUnits));
        }
        setTimeout(() => this.store.dispatch(BasicsActions.readModels()));
      });
    } else {
      this.model.pipe(
        withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
        take(1),
        ).subscribe(([model, attributeTypes]) => {
          const item = model.item;
          if (model.name !== this.form.value.name) {
            item.name = this.form.value.name;
            this.store.dispatch(EditActions.updateConfigurationItem({configurationItem: {
              id: item.id,
              name: item.name,
              typeId: item.typeId,
              lastChange: item.lastChange,
              version: item.version,
            }}));
          }
          let attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Manufacturer);
          this.ensureAttribute(item, attributeType, this.form.value.manufacturer);
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.TargetTypeName);
          this.ensureAttribute(item, attributeType, this.form.value.targetType);
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Height);
          this.ensureAttribute(item, attributeType, this.form.value.height);
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Width);
          this.ensureAttribute(item, attributeType, this.form.value.width);
          attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.HeightUnits);
          this.ensureAttribute(item, attributeType, this.form.value.heightUnits);
          setTimeout(() => this.store.dispatch(BasicsActions.readModels()));
        });
    }
  }

  private getAttributeType(attributeTypes: AttributeType[], name: string) {
    return attributeTypes.find(at => at.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  }

  private ensureAttribute(item: FullConfigurationItem, attributeType: AttributeType, value: string) {
    if (!item.attributes) {
      item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.id);
    if (attribute) { // attribute exists
      if (!value || value === '') { // delete attribute
        this.store.dispatch(EditActions.deleteItemAttribute({itemAttribute: this.createItemAttribute(item.id, attributeType, value,
          attribute.id)}));
      } else {
        if (attribute.value !== value) { // change attribute
          this.store.dispatch(EditActions.updateItemAttribute({itemAttribute: this.createItemAttribute(item.id, attributeType, value,
            attribute.id, attribute.lastChange, attribute.version)}));
        }
      }
    } else if (value && value !== '') { // create attribute
      this.store.dispatch(EditActions.createItemAttribute({itemAttribute: this.createItemAttribute(item.id, attributeType, value)}));
    }
  }

  private createItemAttribute(itemId: string, attributeType: AttributeType, value: string, id: string = Guid.create().toString(),
                              lastChange: Date = new Date(), version: number = 0): ItemAttribute {
    return {
      id,
      lastChange,
      typeId: attributeType.id,
      type: attributeType.name,
      value,
      version,
      itemId,
    };
  }

  private createFullAttribute(attributeType: AttributeType, value: string, id: string = Guid.create().toString(),
                              lastChange: Date = new Date(), version: number = 0): FullAttribute {
    return {
      id,
      lastChange,
      typeId: attributeType.id,
      type: attributeType.name,
      value,
      version,
    };
  }
}
