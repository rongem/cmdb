import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, skipWhile, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { AppConfigService, ConfigurationItem, EditActions, FullConfigurationItem } from 'backend-access';

import { ItemSelectors } from '../../shared/store/store.api';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  form: FormGroup;
  editName = false;
  activeTab = 'attributes';
  private item: FullConfigurationItem;

  constructor(private store: Store, private dialog: MatDialog, private fb: FormBuilder) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      tap(ci => this.item = ci),
    );
  }

  get attributes() {
    return this.store.select(ItemSelectors.configurationItem).pipe(
      map(value => value ? value.attributes : []),
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
    return this.form.get('links') as FormArray;
  }

  ngOnInit() {
    this.configurationItem.pipe(
      withLatestFrom(this.itemReady, this.attributeTypes),
      skipWhile(([, ready, ]) => !ready),
    ).subscribe(([item, , attributeTypes]) => {
      this.item = item;
      this.form = this.fb.group({
        name: this.fb.control(item.name, [Validators.required, this.trimValidator]),
        attributes: this.fb.array(attributeTypes.map(attributeType => this.fb.group({
          typeId: this.fb.control(attributeType.id),
          value: this.fb.control(item.attributes.find(a => a.typeId === attributeType.id)?.value ?? '', []),
        }))),
        links: this.fb.array(item.links.map(link => this.fb.group({
          uri: this.fb.control(link.uri),
          description: this.fb.control(link.description),
        })))
      });
      if (!item.userIsResponsible) {
        this.form.disable();
      }
    });
  }

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.item.id}));
  }

  onChangeItemName(text: string) {
    const configurationItem = ConfigurationItem.copyItem(this.item);
    configurationItem.name = text;
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
    this.editName = false;
  }

  onSave() {}

  onDeleteItem() {
    this.dialog.open(DeleteItemComponent, {
      width: 'auto',
      maxWidth: '70vw',
      // class:
      data: this.item.id,
    });
  }

  onDeleteLink(index: number) {
    this.links.removeAt(index);
    this.links.markAsDirty();
  }

  onAddLink() {
    this.links.push(this.fb.group({
      uri: this.fb.control('https://', [Validators.required, this.urlValidator]),
      description: this.fb.control('', Validators.required),
    }));
  }

  private urlValidator: ValidatorFn = (control: AbstractControl) => {
    if (typeof control.value === 'string' && AppConfigService.validURL(control.value)) {
      return null;
    }
    return {notAValidUrl: true};
  };

  private trimValidator: ValidatorFn = (control: AbstractControl) => {
    if (typeof control.value === 'string' && control.value !== control.value.trim()) {
      return {noTrailingOrLeadingSpacesAllowedError: true};
    }
    return null;
  };

}
