import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap, map, take } from 'rxjs/operators';
import { FullConfigurationItem, MultiEditActions } from 'backend-access';

import { MultiEditSelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-multi-selector',
  templateUrl: './multi-selector.component.html',
  styleUrls: ['./multi-selector.component.scss'],
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
export class MultiSelectorComponent implements OnInit {
  @Input() items: FullConfigurationItem[] = [];
  @Output() selected: EventEmitter<void> = new EventEmitter();

  constructor(private store: Store,
              private router: Router) { }

  ngOnInit() {
  }

  private get itemIds() {
    return this.items.map(item => item.id);
  }

  get areMultipleItemsSelected() {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids.length > 1),
    );
  }

  onSelectAllItems() {
    this.store.dispatch(MultiEditActions.setItemIds({itemIds: this.itemIds}));
  }

  onUnselectItems() {
    this.store.dispatch(MultiEditActions.setItemIds({itemIds: []}));
  }

  onInvertSelection() {
    this.store.select(MultiEditSelectors.selectedIds).pipe(
      take(1),
      map(selectedIds => this.itemIds.filter(id => !selectedIds.includes(id))),
      tap(itemIds => this.store.dispatch(MultiEditActions.setItemIds({itemIds}))),
    ).subscribe();
  }

  onSelectOwnItems() {
    const itemIds = this.items.filter(item => item.userIsResponsible).map(item => item.id);
    this.store.dispatch(MultiEditActions.setItemIds({itemIds}));
  }

  onSelectNotOwnItems() {
    const itemIds = this.items.filter(item => !item.userIsResponsible).map(item => item.id);
    this.store.dispatch(MultiEditActions.setItemIds({itemIds}));
  }

  onMultiEdit() {
    this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(itemIds => this.items.filter(item => itemIds.includes(item.id))),
      take(1),
    ).subscribe(items => {
      this.store.dispatch(MultiEditActions.setSelectedItems({items}));
      this.selected.emit();
      this.router.navigate(['edit-multiple-items']);
    });
  }
}
