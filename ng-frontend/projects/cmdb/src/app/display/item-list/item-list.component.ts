import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeType, ConfigurationItem, ConnectionRule, ConnectionType, ItemType, MetaDataSelectors } from 'backend-access';
import { iif, of, Subscription, switchMap, tap, withLatestFrom } from 'rxjs';
import { ItemSelectors, SearchFormSelectors } from '../../shared/store/store.api';

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

  ngOnInit(): void {
    this.subscription = this.searchItemType.pipe(
      tap(itemType => console.log(itemType, !!itemType)),
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

}
