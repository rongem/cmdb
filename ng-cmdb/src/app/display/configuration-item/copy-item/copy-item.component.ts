import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { take, skipWhile, map } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as EditActions from 'src/app/display/store/edit.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-copy-item',
  templateUrl: './copy-item.component.html',
  styleUrls: ['./copy-item.component.scss']
})
export class CopyItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;
  item = new FullConfigurationItem();
  private itemId: Guid;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit() {
    this.item.id = Guid.create();
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id as Guid;
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: this.itemId}));
      }
      this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        take(1),
        map(value => value.result.Success),
        ).subscribe((value) => {
          if (value === false) {
            this.router.navigate(['display', 'search']);
        }
      });
      this.actions$.pipe(
        ofType(DisplayActions.setConfigurationItem),
        skipWhile(value => value.configurationItem.id === this.itemId),
        take(1),
        map(value => value.configurationItem.id),
      ).subscribe(id => {
        // copy
        this.router.navigate(['display', 'configuration-item', id, 'edit']);
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  onSubmit() {}
}
