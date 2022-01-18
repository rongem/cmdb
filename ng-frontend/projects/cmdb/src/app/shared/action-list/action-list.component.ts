import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';
import { Subscription, take } from 'rxjs';
import { getRouterState } from '../store/router/router.reducer';
import { ItemSelectors, SearchFormSelectors } from '../store/store.api';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
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

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  ngOnInit(): void {
    this.routeSubscription = this.store.select(getRouterState).subscribe(route => {
      const url = route.state.url.includes('?') ? route.state.url.split('?')[0] : route.state.url;
      this.insideList = url === this.displayBaseLink || url.startsWith(this.displayBaseLink + '/item-type/');
      this.itemId = url.startsWith(this.displayBaseLink + '/' + this.itemLinkPart) && route.state.params.id ? route.state.params.id as string : undefined;
      const urlParts = url.split('/').filter(str => !!str);
      this.mode = urlParts[0];
      console.log();
      this.pathExt = urlParts.length > 3 && [this.editBaseLink.substring(1), this.displayBaseLink.substring(1)].includes(urlParts[0]) &&
        urlParts[1] === this.itemLinkPart && this.itemId ? urlParts[3] : undefined;
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

}
