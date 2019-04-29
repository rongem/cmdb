import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SearchContent } from './search-content.model';
import { MetaDataService } from '../../shared/meta-data.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { Subscription } from 'rxjs';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { DataAccessService } from 'src/app/shared/data-access.service';
import { MatMenuTrigger } from '@angular/material';
import { Guid } from 'guid-typescript';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild(MatMenuTrigger) private filterButton: MatMenuTrigger;

  itemTypeName = '';
  visibilityState = false;
  resultListToforeground = false;
  searchForm: FormGroup;
  searchContent: SearchContent;
  attributes = new FormArray([]);
  connectionsToUpper = new FormArray([]);
  connectionsToLower = new FormArray([]);
  useItemType = true;
  itemTypes: ItemType[];
  attributeTypes: AttributeType[];
  itemTypesSubscription: Subscription;
  attributeTypesSubscription: Subscription;


  constructor(private meta: MetaDataService,
              private data: DataAccessService,
              protected searchService: SearchService) { }

  ngOnInit() {
    this.initForm();
    this.attributeTypesSubscription = this.meta.attributeTypesChanged.subscribe(
      (attributeTypes: AttributeType[]) => {
        this.attributeTypes = this.meta.getAttributeTypes();
        this.searchService.setSearchableAttributeTypes(this.attributeTypes);
      }
    );
    this.itemTypesSubscription = this.meta.itemTypesChanged.subscribe(
      (itemTypes: ItemType[]) => {
      this.itemTypes = this.meta.getItemTypes();
    });
    this.attributeTypes = this.meta.getAttributeTypes();
    this.searchService.setSearchableAttributeTypes(this.attributeTypes);
    this.itemTypes = this.meta.getItemTypes();
    this.onItemTypeCheckedChanged();
  }

  toggleVisibility(resultListToforeground: boolean) {
    if (this.visibilityState === false || this.resultListToforeground === resultListToforeground) {
      this.visibilityState = !this.visibilityState;
    }
    this.resultListToforeground = resultListToforeground;
  }

  initForm() {
    this.searchContent = new SearchContent();
    this.searchForm = new FormGroup({
      'NameOrValue': new FormControl(this.searchContent.NameOrValue),
      'ItemType': new FormControl(this.searchContent.ItemType),
      'Attributes': new FormArray([]),
      'ConnectionsToUpper': new FormArray([]),
      'ConnectionsToLower': new FormArray([]),
      'ResponsibleToken': new FormControl(this.searchContent.ResponsibleToken),
    });
    this.searchForm.get('ItemType').disable();
  }

  attributesPresent() {
    return (this.searchForm.get('Attributes') as FormArray).length !== 0;
  }

  onItemTypeCheckedChanged() {
    this.useItemType = !this.useItemType;
    if (this.useItemType) {
      this.searchForm.get('ItemType').enable();
    } else {
      this.searchForm.get('ItemType').disable();
    }
  }

  addItemType(itemType: ItemType) {
    this.searchForm.get('ItemType').enable();
    this.searchForm.get('ItemType').setValue(itemType.TypeId);
    this.itemTypeName = itemType.TypeName;
    this.filterButton.closeMenu();
    this.data.fetchAttributeTypesForItemType(itemType.TypeId).subscribe((attributeTypes: AttributeType[]) => {
      this.attributeTypes = attributeTypes;
      this.searchService.setSearchableAttributeTypes(this.attributeTypes);
      this.searchService.filterAttributes(((this.searchForm.get('Attributes') as FormArray).controls) as FormGroup[]);
    });
  }

  onDeleteItemType() {
    this.searchForm.get('ItemType').disable();
  }

  getAttributeControls() {
    return (this.searchForm.get('Attributes') as FormArray).controls;
  }

  getAttributeTypeName(formGroup: FormGroup) {
    return this.meta.getAttributeType(formGroup.controls.AttributeTypeId.value).TypeName;
  }

  addAttributeType(attributeTypeId: Guid) {
    (this.searchForm.get('Attributes') as FormArray).push(new FormGroup({
      'AttributeTypeId': new FormControl(attributeTypeId, Validators.required),
      'AttributeValue': new FormControl(null),
    }));
  }

  onDeleteIAttribute(index: number) {
    console.log(index);
  }

  onResetForm() {
    this.initForm();
  }

  onSubmit() {
    if (this.attributesPresent()) {
      this.searchForm.get('Attributes').enable();
    } else {
      this.searchForm.get('Attributes').disable();
    }
    this.searchService.search(this.searchForm.value as SearchContent);
    // this.resultListToforeground = true;
  }

}
