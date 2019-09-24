import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';
import * as EditActions from 'src/app/display/store/edit.actions';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  configItemState: Observable<fromDisplay.ConfigurationItemState>;
  private routeSubscription: Subscription;
  private fragmentSubscription: Subscription;
  editName = false;
  itemId: Guid;
  activeTab = 'attributes';
  private item: FullConfigurationItem;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit() {
    this.configItemState = this.store.pipe(select(fromSelectDisplay.getItemState));
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params.id && Guid.isGuid(params.id) && this.route.snapshot.routeConfig.path.startsWith(':id')) {
        this.itemId = params.id as Guid;
        this.store.dispatch(DisplayActions.readConfigurationItem({itemId: this.itemId}));
      }
      this.actions$.pipe(
        ofType(DisplayActions.clearConfigurationItem),
        take(1),
        map(value => value.result.Success)
        ).subscribe((value) => {
          if (value === false || value === true) {
            this.router.navigate(['display', 'search']);
        }
      });
    });
    this.fragmentSubscription = this.route.fragment.subscribe((fragment: string) => {
      this.activeTab = fragment ? fragment : 'links';
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.fragmentSubscription.unsubscribe();
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap(ci => this.item = ci),
    );
  }

  get attributes() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      map(value => value ? value.attributes : []),
    );
  }

  get attributeTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectAttributeTypesForCurrentDisplayItemType));
  }

  get connectionTypes() {
    return this.store.pipe(select(fromSelectDisplay.selectConnectionTypesToLower));
  }

  get userIsResponsible() {
    return this.store.pipe(select(fromSelectDisplay.selectUserIsResponsible));
  }

  onTakeResponsibility() {
    this.store.dispatch(EditActions.takeResponsibility({itemId: this.itemId}));
  }

  onChangeItemName(text: string) {
    const configurationItem: ConfigurationItem = {
      ItemId: this.itemId,
      ItemName: text,
      ItemType: this.item.typeId,
      ItemVersion: this.item.version,
      ItemLastChange: this.item.lastChange,
    };
    this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
    this.editName = false;
  }

}
