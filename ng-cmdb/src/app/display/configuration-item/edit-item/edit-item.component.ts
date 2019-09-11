import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { take, map } from 'rxjs/operators';
import { Guid } from 'src/app/shared/guid';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: params.id as Guid}));
      }
      this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        take(1),
        map(value => value.result.Success)
        ).subscribe((value) => {
          if (value === false) {
            this.router.navigate(['display', 'search']);
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
