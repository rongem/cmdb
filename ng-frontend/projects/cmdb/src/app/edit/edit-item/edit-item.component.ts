import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, skipWhile, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { ConfigurationItem, EditActions, FullConfigurationItem } from 'backend-access';

import { ItemSelectors } from '../../shared/store/store.api';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

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

  ngOnInit() {
    this.itemReady.pipe(
      skipWhile(ready => !ready),
      take(1),
      switchMap(() => this.configurationItem),
      withLatestFrom(this.attributeTypes),
      tap(([item, attributeTypes]) => {
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
      }),
    ).subscribe();
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

  onDeleteItem() {
    this.dialog.open(DeleteItemComponent, {
      width: 'auto',
      maxWidth: '70vw',
      // class:
      data: this.item.id,
    });
  }

  private trimValidator: ValidatorFn = (control: AbstractControl) => {
    if (typeof control.value === 'string' && control.value !== control.value.trim()) {
      return {noTrailingOrLeadingSpacesAllowedError: true};
    }
    return null;
  };

}
