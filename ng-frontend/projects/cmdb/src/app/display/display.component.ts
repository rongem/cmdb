import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchFormSelectors } from '../shared/store/store.api';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  constructor(private store: Store) { }

  get searching() {
    return this.store.select(SearchFormSelectors.searching);
  }

  ngOnInit(): void {
  }

}
