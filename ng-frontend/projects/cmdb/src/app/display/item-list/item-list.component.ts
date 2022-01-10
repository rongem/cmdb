import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeType, ConnectionType } from 'backend-access';
import { take, withLatestFrom } from 'rxjs';
import { ItemActions, ItemSelectors, SearchFormSelectors } from '../../shared/store/store.api';

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
  }

}
