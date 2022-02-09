import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetaDataSelectors, MultiEditActions } from 'backend-access';
import { map, Subscription, take, withLatestFrom } from 'rxjs';
import { getRouterState } from '../store/router/router.reducer';
import { ItemSelectors, MultiEditSelectors, NeighborSearchSelectors, SearchFormSelectors } from '../store/store.api';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss'],
  animations: [
    trigger('showButton', [
      transition('void => *', [
        style({
          color: 'white',
          background: 'white',
          boxShadow: '0.5rem 0.7rem 0.7rem #005',
          transform: 'scale(1.3)',
        }),
        animate(300, style({
          color: 'black',
          background: 'white',
          boxShadow: '0.3rem 0.5rem 0.5rem #005',
          transform: 'scale(1)',
        })),
        animate(300)
      ]),
    ]),
  ],

})
export class ActionListComponent implements OnInit, OnDestroy {
  hidden = false;
  itemId: string;
  insideList = false;
  mode: string;
  displayBaseLink = '/display';
  editBaseLink = '/edit';
  itemLinkPart = 'configuration-item';
  pathExt: string;
  private routeSubscription: Subscription;

  constructor(private store: Store, private router: Router) { }

  get areMultipleItemsSelected() {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids.length > 1),
    );
  }

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get searchItemType() {
    return this.store.select(SearchFormSelectors.searchItemType);
  }

  ngOnInit(): void {
    this.routeSubscription = this.store.select(getRouterState).subscribe(route => {
      let url = route.state.url.includes('?') ? route.state.url.split('?')[0] : route.state.url;
      url = url.includes('#') ? url.split('#')[0] : url;
      this.insideList = url === this.displayBaseLink || url.startsWith(this.displayBaseLink + '/item-type/');
      this.itemId = (url.startsWith(this.displayBaseLink + '/' + this.itemLinkPart) || url.startsWith(this.editBaseLink + '/' + this.itemLinkPart)) &&
        route.state.params.id ? route.state.params.id as string : undefined;
      const urlParts = url.split('/').filter(str => !!str);
      this.mode = urlParts[0];
      this.pathExt = urlParts.length > 3 && urlParts[0] === this.displayBaseLink.substring(1) &&
        urlParts[1] === this.itemLinkPart && this.itemId ? urlParts[3] : urlParts.length === 3 && urlParts[0] === this.editBaseLink.substring(1) ?
        urlParts[0] : undefined;
    });
  }

  ngOnDestroy(): void {
      this.routeSubscription?.unsubscribe();
  }

  gotoList() {
    this.store.select(SearchFormSelectors.searchItemType).pipe(take(1)).subscribe(itemType => {
      if (itemType) {
        this.router.navigate(['display', 'item-type', itemType.id]);
      } else {
        this.router.navigate(['display']);
      }
    });
  }

  onMultiEditItemList() {
    this.store.select(MultiEditSelectors.selectedIds).pipe(
      withLatestFrom(this.resultList),
      map(([itemIds, items]) => items.filter(item => itemIds.includes(item.id))),
      take(1),
    ).subscribe(items => {
      this.store.dispatch(MultiEditActions.setSelectedItems({items}));
      this.router.navigate(['edit-multiple-items']);
    });
  }

  onMultiEditNeigbhorList() {
    this.store.select(MultiEditSelectors.selectedIds).pipe(
      withLatestFrom(this.store.select(NeighborSearchSelectors.resultList)),
      map(([itemIds, items]) => items.filter(item => itemIds.includes(item.fullItem.id)).map(item => item.fullItem)),
      take(1),
    ).subscribe(items => {
      this.store.dispatch(MultiEditActions.setSelectedItems({items}));
      this.router.navigate(['edit-multiple-items']);
    });
  }
}
