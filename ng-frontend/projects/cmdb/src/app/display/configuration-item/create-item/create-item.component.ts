import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { take, skipWhile, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ConfigurationItem, Guid, StoreConstants, EditActions, MetaDataSelectors, ReadActions, ValidatorService } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  itemForm: FormGroup;

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store<fromApp.AppState>,
              private validator: ValidatorService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      id: Guid.create().toString(),
      typeId: Guid.EMPTY.toString(),
      name: '',
      },
      { asyncValidators: [this.validator.validateNameAndType]}
    );
    this.store.select(StoreConstants.METADATA).pipe(
      skipWhile(meta => !meta.validData),
      take(1),
    ).subscribe(meta => {
      if (meta.itemTypes && meta.itemTypes.length > 0) {
        this.itemForm.get('typeId').setValue(meta.itemTypes[0].id);
      }
    });
    this.store.dispatch(ReadActions.clearConfigurationItem({result: { success: true, message: '' }}));
    this.actions$.pipe(
      ofType(ReadActions.setConfigurationItem),
      take(1),
      map(action => action.configurationItem.id)
    ).subscribe(id => this.router.navigate(['display', 'configuration-item', id, 'edit']));
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  onSubmit() {
    this.store.dispatch(EditActions.createConfigurationItem({configurationItem: this.itemForm.value as ConfigurationItem}));
  }

}
