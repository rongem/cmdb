import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { SearchContent } from './search-content.model';
import { MetaDataService } from '../../shared/meta-data.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  visibilityState = false;
  searchForm: FormGroup;
  searchContent: SearchContent;
  attributes = new FormArray([]);
  connectionsToUpper = new FormArray([]);
  connectionsToLower = new FormArray([]);
  useItemType = false;
  itemTypes: ItemType[];
  subscription: Subscription;


  constructor(private meta: MetaDataService) { }

  ngOnInit() {
    this.initForm();
    this.subscription = this.meta.itemTypesChanged.subscribe(
      (itemTypes: ItemType[]) => {
      this.itemTypes = this.meta.getItemTypes();
    });
    this.itemTypes = this.meta.getItemTypes();
  }

  toggleVisibility() {
    this.visibilityState = !this.visibilityState;
  }

  initForm() {
    this.searchContent = new SearchContent();
    this.searchForm = new FormGroup({
      'nameOrValue': new FormControl(this.searchContent.nameOrValue),
      'useItemType': new FormControl(this.useItemType),
      'itemType': new FormControl(this.searchContent.itemType),
      'attributes': this.attributes,
      'connectionsToUpper': this.connectionsToUpper,
      'connectionsToLower': this.connectionsToLower,
      'responsibleToken': new FormControl(this.searchContent.responsibleToken),
    });
  }

  onSubmit() {
    console.log(this.searchForm.value);
  }

}
