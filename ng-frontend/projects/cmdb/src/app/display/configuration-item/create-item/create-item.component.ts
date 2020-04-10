import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, skipWhile, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ConfigurationItem, Guid, Functions, StoreConstants, EditActions, MetaDataSelectors, ReadActions } from 'backend-access';

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
      ItemId: Guid.create(),
      ItemType: Guid.EMPTY,
      ItemName: '',
      },
      { asyncValidators: [this.validateNameAndType.bind(this)]}
    );
    this.store.select(StoreConstants.METADATA).pipe(
      skipWhile(meta => !meta.validData),
      take(1),
    ).subscribe(meta => {
      if (meta.itemTypes && meta.itemTypes.length > 0) {
        this.itemForm.get('ItemType').setValue(meta.itemTypes[0].TypeId);
      }
    });
    this.store.dispatch(ReadActions.clearConfigurationItem({result: {Success: true, Message: ''}}));
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
  getExistingObjects(name: string, typeId: Guid) {
    if (!this.textObjectPresentMap.has(name + '/' + typeId)) {
      this.textObjectPresentMap.set(name + '/' + typeId,
        this.http.get<ConfigurationItem>(Functions.getUrl(
          StoreConstants.CONFIGURATIONITEM + StoreConstants.TYPE + typeId + StoreConstants.NAME + name)
        ).pipe(map(ci => !!ci))
      );
    }
    return this.textObjectPresentMap.get(name + '/' + typeId);
  }

  validateNameAndType(c: FormGroup) {
    return this.getExistingObjects(c.value.ItemName, c.value.ItemType).pipe(
      map(value => value === true ? 'item with this name and type already exists' : null));
  }

}
