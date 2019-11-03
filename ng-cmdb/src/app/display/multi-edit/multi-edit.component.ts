import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';

import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit {
  form: FormGroup;
  itemTypeId: Guid;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
      connectionsToDelete: this.fb.array([]),
      connectionsToAdd: this.fb.array([]),
      linksToDelete: this.fb.array([]),
      linksToAdd: this.fb.array([]),
    });
  }

  get items() {
    return this.store.pipe(
      select(fromSelectMultiEdit.selectItems),
      tap(items => {
        if (!items || items.length === 0) {
          this.router.navigate(['display', 'search']);
        } else {
          this.itemTypeId = items[0].typeId;
        }
      })
    );
  }

  get attributeTypes() {
    return this.store.select(fromSelectMetaData.selectAttributeTypesForItemType, this.itemTypeId);
  }

  get connectionRules() {
    return this.store.pipe(
      select(fromSelectMetaData.selectSingleItemType, this.itemTypeId),
      switchMap(itemType =>
        this.store.select(fromSelectMetaData.selectConnectionRulesForUpperItemType, {itemType})
      )
    );
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.form.valid);
  }

}
