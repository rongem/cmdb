import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeType, ConfigurationItem, ConnectionType, MetaDataSelectors, MultiEditActions } from 'backend-access';
import { map, of, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import { ItemSelectors, MultiEditSelectors, SearchFormSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  displayedAttributeTypesList: AttributeType[] = [];
  displayedConnectionTypesList: ConnectionType[] = [];

  private subscription: Subscription;

  constructor(private store: Store) { }

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  get searchItemType() {
    return this.store.select(SearchFormSelectors.searchItemType);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  ngOnInit(): void {
    this.subscription = this.searchItemType.pipe(
      switchMap(itemType => {
        if (itemType) {
          return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(itemType.id)).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectConnectionRulesForLowerItemType(itemType)),
              this.store.select(MetaDataSelectors.selectConnectionRulesForUpperItemType(itemType))
            ),
          );
        }
        return of(undefined);
    })).subscribe(result => {
      if (result) {
        const [attributeTypes, rulesToUpper, rulesToLower] = result;
        this.displayedAttributeTypesList = attributeTypes;
      }
    });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  getAttributeValue(item: ConfigurationItem, attributeTypeId: string) {
    return item.attributes?.find(a => a.typeId === attributeTypeId)?.value ?? '';
  }

  onItemSelectionChange(target: any, itemId: string) {
    const checked = (target as HTMLInputElement).checked;
    if (checked === true) {
      this.store.dispatch(MultiEditActions.addItemId({itemId}));
    } else {
      this.store.dispatch(MultiEditActions.removeItemId({itemId}));
    }
    this.isIdSelected(itemId).pipe(take(2)).subscribe(result => console.log(result));
  }

  isIdSelected(itemId: string) {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids && ids.includes(itemId))
    );
  }

}
