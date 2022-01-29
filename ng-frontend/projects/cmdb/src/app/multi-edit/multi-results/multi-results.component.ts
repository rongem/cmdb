import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogSelectors } from 'backend-access';

@Component({
  selector: 'app-multi-results',
  templateUrl: './multi-results.component.html',
  styleUrls: ['./multi-results.component.scss']
})
export class MultiResultsComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  get logEntries() {
    return this.store.select(LogSelectors.selectLogEntriesSorted);
  }

}
