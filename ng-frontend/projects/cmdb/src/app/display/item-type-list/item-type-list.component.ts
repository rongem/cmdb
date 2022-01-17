import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetaDataSelectors } from 'backend-access';

@Component({
  selector: 'app-item-type-list',
  templateUrl: './item-type-list.component.html',
  styleUrls: ['./item-type-list.component.scss']
})
export class ItemTypeListComponent implements OnInit {
  hidden = false;

  constructor(private store: Store) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  ngOnInit(): void {
  }

}
