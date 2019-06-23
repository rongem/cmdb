import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';

import { SearchContent } from '../search-content.model';
import { SearchService } from '../search.service';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/shared/store/app.reducer';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  metaData = this.store.select(fromApp.METADATA);

  constructor(public meta: MetaDataService,
              private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
  }

  onAddItemType(itemType: ItemType) {
    this.searchService.addItemType(itemType);
  }

  onDeleteItemType() {
    this.searchService.deleteItemType();
  }

  onAddAttributeType(attributeTypeId: Guid) {
    this.searchService.addAttributeType(attributeTypeId);
  }

  onDeleteAttribute(index: number) {
    this.searchService.deleteAttributeType(index);
  }

  onDeleteConnectionToUpper(index: number) {
    this.searchService.deleteConnectionToUpper(index);
  }

  onDeleteConnectionToLower(index: number) {
    this.searchService.deleteConnectionToLower(index);
  }

  onResetForm() {
    this.searchService.searchContent = new SearchContent();
    this.searchService.initForm();
  }

  onSubmit() {
    this.searchService.search(this.searchService.searchForm.value as SearchContent);
  }

  log(val: any) {
    console.log(val);
  }

}
