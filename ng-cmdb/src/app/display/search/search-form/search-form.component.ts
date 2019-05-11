import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material';
import { Guid } from 'guid-typescript';

import { SearchContent } from '../search-content.model';
import { SearchService } from '../search.service';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { DataAccessService } from 'src/app/shared/data-access.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  constructor(public meta: MetaDataService,
              private data: DataAccessService,
              public searchService: SearchService) { }

  ngOnInit() {
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
