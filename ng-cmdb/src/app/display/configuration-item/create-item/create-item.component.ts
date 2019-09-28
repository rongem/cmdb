import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, skipWhile, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as EditActions from 'src/app/display/store/edit.actions';

import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  item = new ConfigurationItem();

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.item.ItemId = Guid.create();
    this.store.select(fromApp.METADATA).pipe(
      skipWhile(meta => !meta.validData),
      take(1),
    ).subscribe(meta => {
      if (meta.itemTypes && meta.itemTypes.length > 0) {
        this.item.ItemType = meta.itemTypes[0].TypeId;
      }
    });
    this.store.dispatch(DisplayActions.clearConfigurationItem({result: {Success: true, Message: ''}}));
    this.actions$.pipe(
      ofType(DisplayActions.setConfigurationItem),
      take(1),
      map(action => action.configurationItem.id)
    ).subscribe(id => this.router.navigate(['display', 'configuration-item', id, 'edit']));
  }

  get itemTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectItemTypes));
  }

  onSubmit() {
    this.store.dispatch(EditActions.createConfigurationItem({configurationItem: this.item}));
  }

}
