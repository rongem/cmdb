import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of, switchMap, take, tap } from 'rxjs';
import { AttributeType, FullConfigurationItem, MetaDataSelectors } from 'backend-access';
import { MultiEditSelectors } from '../shared/store/store.api';
import { MultiEditService } from './services/multi-edit.service';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit {
  form: FormGroup;
  itemTypeId: string;

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private mes: MultiEditService,
              public dialog: MatDialog) { }

  get items() {
    return this.store.select(MultiEditSelectors.selectedItems);
  }

  get resultColumns() {
    return this.store.select(MultiEditSelectors.selectResultListFullColumns);
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

  ngOnInit() {
    this.items.pipe(
      tap(items => {
        // check if there are items and are all of the same type
        if (!items || items.length === 0 || [...new Set(items.map(i => i.typeId))].length !== 1) {
          this.router.navigate(['display']);
        } else {
          this.itemTypeId = items[0].typeId;
        }
      }),
      take(1),
    ).subscribe();
    this.form = this.fb.group({
      attributes: this.fb.array([]),
      connectionsToDelete: this.fb.array([]),
      connectionsToAdd: this.fb.array([]),
      linksToDelete: this.fb.array([]),
      linksToAdd: this.fb.array([]),
    });
  }

  getValue(ci: FullConfigurationItem, attributeTypeId: string) {
    const att = ci.attributes.find(a => a.typeId === attributeTypeId);
    return att ? att.value : '-';
  }

  getConnections(ci: FullConfigurationItem, prop: string) {
    const val = prop.split(':');
    switch (val[0]) {
      case 'ctl':
        return ci.connectionsToLower.filter(c => c.ruleId.toString() === val[1]);
      case 'ctu':
        return ci.connectionsToUpper.filter(c => c.ruleId.toString() === val[1]);
      default:
        return [];
    }
  }

  onSubmit() {
    this.mes.change(this.form.value);
    this.router.navigate(['working'], {relativeTo: this.route });
  }

}
