import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeType, ConnectionType } from 'backend-access';
import { take } from 'rxjs';
import { ItemActions, ItemSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  displayedAttributeTypesList: AttributeType[] = [];
  displayedConnectionTypesList: ConnectionType[] = [];

  constructor(private store: Store) { }

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  ngOnInit(): void {
    this.store.select(ItemSelectors.resultListPresent).pipe(take(1)).subscribe(listPresent => {
      if (!listPresent) {
        this.store.dispatch(ItemActions.readDefaultResultList());
      }
    });
  }

}
