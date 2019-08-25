import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';

import { SearchContent } from '../search-content.model';
import { SearchService } from '../search.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import * as fromApp from 'src/app/shared/store/app.reducer';
import * as SearchActions from '../store/search.actions';
import * as fromSearch from '../store/search.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  metaData: Observable<fromMetaData.State>;
  search: Observable<fromSearch.State>;

  constructor(private store: Store<fromApp.AppState>,
              public searchService: SearchService) { }

  ngOnInit() {
    this.metaData = this.store.select(fromApp.METADATA);
    this.search = this.store.select(fromApp.SEARCH);
  }

  onDeleteConnectionToUpper(index: number) {
    // this.store.dispatch(new SearchActions.DeleteConnectionTypeToUpper());
    this.searchService.deleteConnectionToUpper(index);
  }

  onDeleteConnectionToLower(index: number) {
    // this.store.dispatch(new SearchActions.DeleteConnectionTypeToLower());
    this.searchService.deleteConnectionToLower(index);
  }

  onAddResponsibility() {
    const sub = this.metaData.subscribe((value: fromMetaData.State) => {
      this.searchService.addResponsibility(value.userName);
      sub.unsubscribe();
    });
  }

  onResetForm() {
    this.searchService.searchContent = new SearchContent();
    this.searchService.initForm();
  }

  onSubmit() {
    console.log(this.searchService.searchForm.value);
    if (!this.searchService.searchForm.value.NameOrValue) {
      this.searchService.searchForm.value.NameOrValue = '';
    }
    if (!this.searchService.searchForm.value.ItemType) {
      this.searchService.searchForm.value.ItemType = '';
    }
    if (this.searchService.searchForm.value.NameOrValue === '' && this.searchService.searchForm.value.ItemType === '') {
      return;
    }
    console.log(this.searchService.searchForm.value);

    this.store.dispatch(new SearchActions.PerformSearch(this.searchService.searchForm.value as SearchContent));
  }

  getItemTypes(data: Map<Guid, ItemType[]>, id: Guid) {
    if (!data.has(id)) {
      return [];
    }
    return data.get(id);
  }

  log(val: any) {
    console.log(val);
    return val;
  }

}
