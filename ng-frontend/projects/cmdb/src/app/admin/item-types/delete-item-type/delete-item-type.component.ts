import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { iif, of, Subscription, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ItemType, ConnectionRule, ReadFunctions, ConfigurationItem, MetaDataSelectors, AdminActions, MetaDataActions } from 'backend-access';

import * as fromSelectAdmin from '../../store/admin.selectors';
import { setCurrentItemType } from '../../store/admin.actions';

@Component({
  selector: 'app-delete-item-type',
  templateUrl: './delete-item-type.component.html',
  styleUrls: ['./delete-item-type.component.scss']
})
export class DeleteItemTypeComponent implements OnInit, OnDestroy {
  itemType?: ItemType;
  items?: ConfigurationItem[];
  private subscription?: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private store: Store) { }

  get attributeGroups() {
    return this.itemType?.attributeGroups?.map(g => g.id);
  }

  get attributeTypes() {
    return this.store.select(fromSelectAdmin.selectAttributeTypesForCurrentItemType);
  }

  get connectionRulesToLower() {
    return this.store.select(fromSelectAdmin.selectConnectionRulesForCurrentIsUpperItemType);
  }

  get connectionRulesToUpper() {
    return this.store.select(fromSelectAdmin.selectConnectionRulesForCurrentIsLowerItemType);
  }

  ngOnInit() {
    if (this.route.snapshot.params.id && this.route.snapshot.routeConfig.path.startsWith('item-types/delete/:id')) {
      this.subscription = this.store.select(MetaDataSelectors.selectSingleItemType(this.route.snapshot.params.id)).pipe(
        tap(itemType => {
          if (!itemType) {
            this.routeToItemTypes();
          }
          this.itemType = itemType;
          this.store.dispatch(setCurrentItemType({itemType}));
        }),
        switchMap(itemType => iif(() => !!itemType, ReadFunctions.configurationItemsByTypes(this.http, [itemType?.id]), of(undefined))),
        tap(items => this.items = items),
      ).subscribe();

    } else {
      console.log('illegal id params');
      this.routeToItemTypes();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  countRules(rulesToUpper: ConnectionRule[], rulesToLower: ConnectionRule[]) {
    return rulesToUpper.length + rulesToLower.length;
  }

  routeToItemTypes() {
    this.router.navigate(['admin', 'item-types']);
  }

  onDeleteItemType() {
    this.store.dispatch(setCurrentItemType({itemType: undefined}));
    this.store.dispatch(AdminActions.deleteItemType({itemType: this.itemType}));
    this.store.dispatch(MetaDataActions.readState());
    this.routeToItemTypes();
  }

}
