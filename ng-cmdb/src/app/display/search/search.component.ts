import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { SearchContent } from './search-content.model';
import { AttributeTypeService } from '../../shared/attribute-type.service';

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


  constructor(private ats: AttributeTypeService) { }

  ngOnInit() {
    this.initForm();
  }

  toggleVisibility() {
    console.log('Was here');
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
    this.ats.getAttributeTypes().subscribe((values: any) => {
      console.log(values);
    });
  }

}
