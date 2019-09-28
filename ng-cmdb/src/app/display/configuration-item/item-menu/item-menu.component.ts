import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  itemId: Guid;
  baseLink: string;
  pathExt: string;
  get userRole() {
    return this.store.pipe(select(fromSelectMetaData.selectUserRole));
  }


  constructor(private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id as Guid;
        if (this.route.snapshot.routeConfig.path.endsWith(':id')) {
          this.baseLink = './';
        } else {
          this.baseLink = '../';
        }
        if (this.route.snapshot.routeConfig.path.indexOf('/') > -1) {
          this.pathExt = this.route.snapshot.routeConfig.path.split('/', 3)[1];
        } else {
          this.pathExt = '';
        }
      } else {
        this.itemId = undefined;
        this.baseLink = './';
        this.pathExt = this.route.snapshot.routeConfig.path;
      }
      // console.log(this.pathExt, this.baseLink);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
