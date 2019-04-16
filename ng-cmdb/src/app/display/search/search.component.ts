import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { SearchContent } from './search-content.model';
import { MetaDataService } from '../../shared/meta-data.service';

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


  constructor(private meta: MetaDataService) { }

  ngOnInit() {
    this.initForm();
    this.meta.getItemTypes();
  }

  toggleVisibility() {
    this.visibilityState = !this.visibilityState;
  }

  initForm() {
    this.searchContent = new SearchContent();
    this.searchForm = new FormGroup({
      'nameOrValue': new FormControl(this.searchContent.nameOrValue),
      'itemType': new FormControl(this.searchContent.itemType),
      'attributes': this.attributes,
      'connectionsToUpper': this.connectionsToUpper,
      'connectionsToLower': this.connectionsToLower,
      'responsibleToken': new FormControl(this.searchContent.responsibleToken),
    });
  }

  onSubmit() {
    console.log(this.searchForm.value);
    this.meta.getAttributeTypes().subscribe((values: any) => {
      console.log(values);
    });
  }

}
