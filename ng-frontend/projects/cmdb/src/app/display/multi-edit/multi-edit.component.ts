import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AttributeType, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../shared/store/app.reducer';
import * as fromSelectMultiEdit from '../store/multi-edit.selectors';

import { MultiEditService } from './multi-edit.service';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit {
  form: FormGroup;
  itemTypeId: string;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private mes: MultiEditService,
              public dialog: MatDialog) { }

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
    return this.store.select(fromSelectMultiEdit.selectItems).pipe(
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
    if (!this.itemTypeId) {
      return of([] as AttributeType[]);
    }
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.itemTypeId));
  }

  get connectionRules() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId)).pipe(
      switchMap(itemType =>
        this.store.select(MetaDataSelectors.selectConnectionRulesForUpperItemType(itemType))
      )
    );
  }

  onSubmit() {
    // console.log(this.form.value);
    this.mes.change(this.form.value);
    this.router.navigate(['working'], {relativeTo: this.route });
    // const dialogRef = this.dialog.open(MultiResultsComponent, {
    //   width: 'auto',
    //   maxWidth: '70vw',
    //   // class:
    //   // data: this.itemId,
    // });
    // dialogRef.afterClosed().subscribe(() => this.router.navigate(['display', 'search']));
  }

}
