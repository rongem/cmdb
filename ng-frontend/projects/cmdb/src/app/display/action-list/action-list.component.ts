import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItemSelectors } from '../../shared/store/store.api';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {
  hidden = false;

  constructor(private store: Store) { }

  get resultList() {
    return this.store.select(ItemSelectors.resultList);
  }

  ngOnInit(): void {
  }

}
