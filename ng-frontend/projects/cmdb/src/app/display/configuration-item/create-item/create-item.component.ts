import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, skipWhile, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ConfigurationItem, Guid, StoreConstants, EditActions, MetaDataSelectors, ReadActions, ReadFunctions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  itemForm: FormGroup;
  private textObjectPresentMap = new Map<string, Observable<boolean>>();

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store<fromApp.AppState>,
              private http: HttpClient,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.itemForm = this.fb.group({
      id: Guid.create().toString(),
      typeId: Guid.EMPTY.toString(),
      name: '',
      },
      { asyncValidators: [this.validateNameAndType.bind(this)]}
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

  // cache queries for items of that type and name
  getExistingObjects(name: string, typeId: string) {
    if (!this.textObjectPresentMap.has(name + '/' + typeId)) {
      this.textObjectPresentMap.set(name + '/' + typeId,
      ReadFunctions.itemForTypeIdAndName(this.http, typeId, name).pipe(map(ci => !ci))
      );
    }
    return this.textObjectPresentMap.get(name + '/' + typeId);
  }

  validateNameAndType(c: FormGroup) {
    return this.getExistingObjects(c.value.name, c.value.typeId).pipe(
      map(value => value === true ? 'item with this name and type already exists' : null));
  }

}
