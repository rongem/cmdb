import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, map, take } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';
import * as MultiEditActions from 'src/app/display/store/multi-edit.actions';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

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
        }),
        animate(300, style({
          color: 'black',
          background: 'white',
        })),
        animate(300)
      ]),
    ]),
  ],
})
export class MultiSelectorComponent implements OnInit {
  @Input() items: FullConfigurationItem[] = [];
  @Output() selected: EventEmitter<void> = new EventEmitter();

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
  }

  private get itemIds() {
    return this.items.map(item => item.id);
  }

  get areMultipleItemsSelected() {
    return this.store.pipe(
      select(fromSelectMultiEdit.selectIds),
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
    this.store.pipe(
      select(fromSelectMultiEdit.selectIds),
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
    this.store.pipe(
      select(fromSelectMultiEdit.selectIds),
      map(itemIds => this.items.filter(item => itemIds.includes(item.id))),
      take(1),
    ).subscribe(items => {
      this.store.dispatch(MultiEditActions.setSelectedItems({items}));
      this.selected.emit();
      this.router.navigate(['display', 'multi-edit']);
    });
  }
}
