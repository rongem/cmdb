import { Component, OnInit, OnDestroy, Attribute } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, withLatestFrom, skipWhile, take, switchMap } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as DataActions from 'src/app/shared/store/data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { selectRouterStateId } from 'src/app/shared/store/router/router.reducer';
import { Model } from 'src/app/shared/objects/model.model';
import { Guid } from 'src/app/shared/guid';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Mappings } from 'src/app/shared/objects/appsettings/mappings.model';
import { AttributeType } from 'src/app/shared/objects/rest-api/attribute-type.model';
import { FullConfigurationItem } from 'src/app/shared/objects/rest-api/full-configuration-item.model';
import { ItemAttribute } from 'src/app/shared/objects/rest-api/item-attribute.model';
import { FullAttribute } from 'src/app/shared/objects/rest-api/full-attribute.model';

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
        model.id = Guid.create();
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
        select(fromSelectMetaData.selectSingleItemTypeByName, AppConfigService.objectModel.ConfigurationItemTypeNames.Model),
        withLatestFrom(this.store.select(fromSelectMetaData.selectAttributeTypes)),
        take(1),
      ).subscribe(([itemType, attributeTypes]) => {
        item.typeId = itemType.TypeId;
        item.type = itemType.TypeName;
        item.color = itemType.TypeBackColor;
        let attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Manufacturer);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.manufacturer));
        attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.TargetTypeName);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.targetType));
        attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Height);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.height));
        attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.Width);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.width));
        attributeType = this.getAttributeType(attributeTypes, AppConfigService.objectModel.AttributeTypeNames.HeightUnits);
        item.attributes.push(this.createFullAttribute(attributeType, this.form.value.heightUnits));
      });
    } else {
      this.model.pipe(
        withLatestFrom(this.store.select(fromSelectMetaData.selectAttributeTypes)),
        take(1),
        ).subscribe(([model, attributeTypes]) => {
          const item = model.item;
          if (model.name !== this.form.value.name) {
            item.name = this.form.value.name;
            this.store.dispatch(DataActions.updateItem({item: { ItemId: item.id,
              ItemName: item.name,
              ItemType: item.typeId,
              ItemLastChange: item.lastChange,
              ItemVersion: item.version,
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
        });
    }
  }

  private getAttributeType(attributeTypes: AttributeType[], name: string) {
    return attributeTypes.find(at => at.TypeName.toLocaleLowerCase() === name.toLocaleLowerCase());
  }

  private ensureAttribute(item: FullConfigurationItem, attributeType: AttributeType, value: string) {
    if (!item.attributes) {
      item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.TypeId);
    if (attribute) { // attribute exists
      if (!value || value === '') { // delete attribute
        this.store.dispatch(DataActions.deleteAttribute({attribute: this.createItemAttribute(item.id, attributeType, value,
          attribute.id)}));
      } else {
        if (attribute.value !== value) { // change attribute
          this.store.dispatch(DataActions.updateAttribute({attribute: this.createItemAttribute(item.id, attributeType, value,
            attribute.id, attribute.lastChange, attribute.version)}));
        }
      }
    } else if (value && value !== '') { // create attribute
      this.store.dispatch(DataActions.createAttribute({attribute: this.createItemAttribute(item.id, attributeType, value)}));
    }
  }

  private createItemAttribute(itemId: Guid, attributeType: AttributeType, value: string, id: Guid = Guid.create(),
                              lastChange: Date = new Date(), version: number = 0): ItemAttribute {
    return {
      AttributeId: id,
      AttributeLastChange: lastChange,
      AttributeTypeId: attributeType.TypeId,
      AttributeTypeName: attributeType.TypeName,
      AttributeValue: value,
      AttributeVersion: version,
      ItemId: itemId,
    };
  }

  private createFullAttribute(attributeType: AttributeType, value: string, id: Guid = Guid.create(),
                              lastChange: Date = new Date(), version: number = 0): FullAttribute {
    return {
      id,
      lastChange,
      typeId: attributeType.TypeId,
      type: attributeType.TypeName,
      value,
      version,
    };
  }
}
