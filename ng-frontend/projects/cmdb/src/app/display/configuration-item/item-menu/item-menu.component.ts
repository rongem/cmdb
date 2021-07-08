import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectNeighbor from '../../store/neighbor.selectors';
import * as fromSelectDisplay from '../../store/display.selectors';

import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { ShowHistoryComponent } from '../show-history/show-history.component';
import { ExportItemComponent } from '../export-item/export-item.component';
import { ExportItemsComponent } from '../export-items/export-items.component';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit, OnDestroy {
  itemId: string;
  baseLink: string;
  pathExt: string;
  private routeSubscription: Subscription;

  get userRole() {
    return this.store.select(MetaDataSelectors.selectUserRole);
  }

  get resultsPresent() {
    return this.store.pipe(
      select(fromSelectDisplay.getResultState),
      map(state => state.resultListPresent),
    );
  }

  get neighborsPresent() {
    return this.store.pipe(
      select(fromSelectNeighbor.getState),
      map(state => state.resultListFullPresent),
    );
  }

  constructor(private route: ActivatedRoute,
              private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id;
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

  onDeleteItem() {
    this.dialog.open(DeleteItemComponent, {
      width: 'auto',
      maxWidth: '70vw',
      // class:
      data: this.itemId,
    });
  }

  onShowHistory() {
    this.dialog.open(ShowHistoryComponent, {
      width: 'auto',
      maxWidth: '70vw',
      // class:
      data: this.itemId,
    });
  }

  onExportItem() {
    this.dialog.open(ExportItemComponent, {
      width: 'auto',
      minWidth: '20rem',
      maxWidth: '70vw',
      // class:
      data: this.itemId,
    });
  }

  onExportItemList() {
    this.store.select(fromSelectDisplay.selectResultList).pipe(take(1)).subscribe(resultList => {
      this.dialog.open(ExportItemsComponent, {
        width: 'auto',
        maxWidth: '70vw',
        // class:
        data: resultList,
      });
    });
  }

  onExportItemNeighborList() {
    this.store.select(fromSelectNeighbor.getState).pipe(
      map(state => state.resultList.map(resultItem => resultItem.fullItem)),
      take(1),
    ).subscribe(resultList => {
      this.dialog.open(ExportItemsComponent, {
        width: 'auto',
        maxWidth: '70vw',
        // class:
        data: resultList,
      });
    });
  }
}
