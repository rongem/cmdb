import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { Store } from '@ngrx/store';
import { tap, map, take } from 'rxjs';
import { FullConfigurationItem, MultiEditActions } from 'backend-access';

import { MultiEditSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-multi-selector',
  templateUrl: './multi-selector.component.html',
  styleUrls: ['./multi-selector.component.scss'],
})
export class MultiSelectorComponent implements OnInit {
  @Input() items: FullConfigurationItem[] = [];
  @Output() selected: EventEmitter<void> = new EventEmitter();

  constructor(private store: Store) { }

  get areMultipleItemsSelected() {
    return this.store.select(MultiEditSelectors.selectedIds).pipe(
      map(ids => ids.length > 1),
    );
  }

  private get itemIds() {
    return this.items.map(item => item.id);
  }

  ngOnInit() {
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
}
