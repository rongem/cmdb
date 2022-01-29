import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromSelectProv from '../../shared/store/provisionable/provisionable.selectors';
import * as fromApp from '../../shared/store/app.reducer';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';
import { AssetStatus } from '../../shared/objects/asset/asset-status.enum';
import { BladeEnclosure } from '../../shared/objects/asset/blade-enclosure.model';
import { RackServerHardware } from '../../shared/objects/asset/rack-server-hardware.model';
import { BladeServerHardware } from '../../shared/objects/asset/blade-server-hardware.model';
import { Asset } from '../../shared/objects/prototypes/asset.model';
import { ProvisionedSystem } from '../../shared/objects/asset/provisioned-system.model';
import { Mappings } from '../../shared/objects/appsettings/mappings.model';
import { ExtendedAppConfigService } from '../../shared/app-config.service';
import { llc, llcc } from '../../shared/store/functions';
import { EnclosureMountable } from '../../shared/objects/asset/enclosure-mountable.model';

@Component({
  selector: 'app-mountable-form',
  templateUrl: './mountable-form.component.html',
  styleUrls: ['./mountable-form.component.scss']
})
export class MountableFormComponent implements OnInit, OnDestroy {
  @Input() mountable: RackMountable | EnclosureMountable;
  @Output() changedStatus = new EventEmitter<AssetStatus>();
  @Output() dropProvisionedSystem = new EventEmitter<{provisionedSystem: ProvisionedSystem; status: AssetStatus}>();
  @Output() connectExistingSystem = new EventEmitter<{systemId: string; typeName: string; status: AssetStatus}>();
  @Output() disconnectProvisionedSystem =
    new EventEmitter<{provisionedSystem: ProvisionedSystem; serverHardware: RackServerHardware | BladeServerHardware}>();
  @Output() createProvisionableSystem = new EventEmitter<{name: string; typeName: string; status: AssetStatus}>();
  @Output() removeAsset = new EventEmitter<AssetStatus>();
  form: FormGroup;
  isServer = false;
  isBladeEnclosure = false;
  isEnclosureBacksideType = false;
  isAddingProvisionedSystem = false;
  private subscription: Subscription;
  private inValidation = false;

  constructor(private store: Store<fromApp.AppState>,
              private fb: FormBuilder) { }

  get provisionedSystem() {
    if (this.isServer) {
      if (this.mountable instanceof RackServerHardware) {
        return this.mountable.provisionedSystem;
      }
      if (this.mountable instanceof BladeServerHardware) {
        return this.mountable.provisionedSystem;
      }
    }
    return undefined;
  }

  get provisionedTypes() {
    return Mappings.provisionedSystems;
  }

  get availableProvisionedSystems() {
    return this.store.select(fromSelectProv.selectAvailableSystemsByTypeName(this.form.value.typeName));
  }

  get containerName() {
    if (Mappings.rackMountables.includes(llc(this.mountable.item.type))) {
      return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack;
    }
    if (Mappings.enclosureMountables.includes(llc(this.mountable.item.type))) {
      return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure;
    }
    return 'container';
  }

  get selectOrCreate() {
    return this.form.get('selectOrCreate').value;
  }

  set selectOrCreate(value: string) {
    this.form.get('selectOrCreate').setValue(value);
    this.setValidators();
  }

  ngOnInit(): void {
    this.isServer = this.mountable instanceof RackServerHardware || this.mountable instanceof BladeServerHardware;
    this.isBladeEnclosure = this.mountable instanceof BladeEnclosure;
    this.isEnclosureBacksideType = Mappings.enclosureBackSideMountables.includes(llc(this.mountable.item.type));
    this.form = this.fb.group({
      name: '',
      typeName: [this.provisionedTypes[0], Validators.required],
      selectOrCreate: 'create',
      targetId: '',
    });
    this.subscription = this.form.valueChanges.subscribe(() => this.setValidators());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  setValidators() {
    if (this.inValidation) { return; }
    this.inValidation = true;
    const name = this.form.get('name');
    const typeName = this.form.get('typeName');
    if (this.form.value.selectOrCreate === 'create') {
      name.setValidators([Validators.required]);
      typeName.setValidators(null);
      this.form.setAsyncValidators(this.validateNameAndType);
    } else {
      name.setValidators(null);
      typeName.setValidators([Validators.required]);
      this.form.setAsyncValidators(null);
    }
    name.updateValueAndValidity();
    typeName.updateValueAndValidity();
    this.form.updateValueAndValidity();
    this.inValidation = false;
  }

  validateNameAndType: AsyncValidatorFn = (c: AbstractControl) => this.store.select(fromSelectProv.selectSystemsByTypeName(c.value.typeName)).pipe(
      map(systems => systems.some(s => llcc(s.name, c.value.name)) ?
        of({nameAndTypeExistError: true}) : null
      )
    );

  getStatusName(status: AssetStatus) {
    return Asset.getStatusCodeForAssetStatus(status).name;
  }

  setStatus(status: AssetStatus) {
    if (status === AssetStatus.Stored || status === AssetStatus.Scrapped) {
      this.removeAsset.emit(status);
    } else if (this.isServer && this.provisionedSystem &&
      status !== AssetStatus.Fault && status !== AssetStatus.InProduction && status !== AssetStatus.RepairPending) {
      this.dropProvisionedSystem.emit({provisionedSystem: this.provisionedSystem, status});
    } else {
      this.changedStatus.emit(status);
    }
  }

  createProvisionable(status: AssetStatus) {
    this.createProvisionableSystem.emit({name: this.form.value.name, typeName: this.form.value.typeName, status});
  }

  connectProvisionable(status: AssetStatus) {
    this.connectExistingSystem.emit({systemId: this.form.value.targetId, typeName: this.form.value.typeName, status});
  }

  disconnectProvisionable() {
    if (this.mountable instanceof RackServerHardware || this.mountable instanceof BladeServerHardware) {
      this.disconnectProvisionedSystem.emit({provisionedSystem: this.provisionedSystem, serverHardware: this.mountable});
    }
  }

}
