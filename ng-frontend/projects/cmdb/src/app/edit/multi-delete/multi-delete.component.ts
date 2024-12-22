import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take, withLatestFrom } from 'rxjs';
import { MultiEditSelectors, SearchFormSelectors } from '../../shared/store/store.api';
import { MultiEditService } from '../services/multi-edit.service';

@Component({
    selector: 'app-multi-delete',
    templateUrl: './multi-delete.component.html',
    styleUrls: ['./multi-delete.component.scss'],
    animations: [
        trigger('vanishingRow', [
            transition('* => void', [
                animate(300, style({
                    transform: 'rotateX(30deg)'
                })),
                animate(200, style({
                    transform: 'rotateX(90deg)'
                })),
            ])
        ])
    ],
    standalone: false
})
export class MultiDeleteComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private store: Store,
              private router: Router,
              private mes: MultiEditService
  ) { }

  get items() {
    return this.store.select(MultiEditSelectors.selectedItems);
  }

  get working() {
    return this.store.select(MultiEditSelectors.selectOperationsLeft);
  }

  ngOnInit(): void {
    this.subscription = this.items.pipe(
      withLatestFrom(
        this.store.select(SearchFormSelectors.searchItemType),
      ),
    ).subscribe(([items, itemType]) => {
      if (!items || items.length === 0) {
        const target = ['display'];
        if (itemType) {
          target.push(itemType.id);
        }
        this.router.navigate(target);
      }
    });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  getIsItemProcessed(itemId: string) {
    return this.store.select(MultiEditSelectors.idPresent(itemId));
  }

  onDeleteItems() {
    this.items.pipe(take(1)).subscribe(items => {
      this.mes.deleteItems(items);
    });
  }

}
