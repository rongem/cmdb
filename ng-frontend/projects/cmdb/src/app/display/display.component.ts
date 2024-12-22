import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { iif, map, mergeMap, of, Subscription, tap } from 'rxjs';
import { MetaDataSelectors, SearchActions } from 'backend-access';
import { ItemActions, SearchFormActions, SearchFormSelectors } from '../shared/store/store.api';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    standalone: false
})
export class DisplayComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private store: Store, private route: ActivatedRoute) { }

  get searching() {
    return this.store.select(SearchFormSelectors.searching);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(params => params?.id ?? undefined),
      mergeMap(id => iif(() => !!id, this.store.select(MetaDataSelectors.selectSingleItemType(id)), of(undefined))),
      tap(itemType => {
        if (itemType) {
          this.store.dispatch(SearchFormActions.addItemType({typeId: itemType.id}));
        } else {
          this.store.dispatch(SearchFormActions.deleteItemType());
        }
      }),
      mergeMap(() => this.store.select(SearchFormSelectors.getForm)),
    ).subscribe(searchContent => {
      if ((searchContent.nameOrValue === '' && !searchContent.itemTypeId && searchContent.attributes.length === 0)) {
        this.store.dispatch(ItemActions.readDefaultResultList());
      } else {
        this.store.dispatch(SearchActions.performSearchFull({searchContent}));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
