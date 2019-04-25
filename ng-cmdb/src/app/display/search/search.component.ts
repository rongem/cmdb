import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
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

  @ViewChild(MatMenuTrigger) filterButton: MatMenuTrigger;

  itemTypeName = '';
  visibilityState = false;
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

  toggleVisibility() {
    this.visibilityState = !this.visibilityState;
  }

  initForm() {
    this.searchContent = new SearchContent();
    this.searchForm = new FormGroup({
      'nameOrValue': new FormControl(this.searchContent.nameOrValue),
      'itemType': new FormControl(this.searchContent.itemType),
      'attributes': new FormArray([]),
      'connectionsToUpper': new FormArray([]),
      'connectionsToLower': new FormArray([]),
      'responsibleToken': new FormControl(this.searchContent.responsibleToken),
    });
    this.searchForm.get('itemType').disable();
  }

  attributesPresent() {
    return (this.searchForm.get('attributes') as FormArray).length !== 0;
  }

  onItemTypeCheckedChanged() {
    this.useItemType = !this.useItemType;
    if (this.useItemType) {
      this.searchForm.get('itemType').enable();
    } else {
      this.searchForm.get('itemType').disable();
    }
  }

  addItemType(itemType: ItemType) {
    this.searchForm.get('itemType').enable();
    this.searchForm.get('itemType').setValue(itemType.typeId);
    this.itemTypeName = itemType.typeName;
    this.filterButton.closeMenu();
    this.data.fetchAttributeTypesForItemType(itemType.typeId).subscribe((attributeTypes: AttributeType[]) => {
      this.attributeTypes = attributeTypes;
      this.searchService.setSearchableAttributeTypes(this.attributeTypes);
      this.searchService.filterAttributes(((this.searchForm.get('attributes') as FormArray).controls) as FormGroup[]);
    });
  }

  onDeleteItemType() {
    this.searchForm.get('itemType').disable();
  }

  getAttributeControls() {
    return (this.searchForm.get('attributes') as FormArray).controls;
  }

  getAttributeTypeName(formGroup: FormGroup) {
    return this.meta.getAttributeType(formGroup.controls.AttributeTypeId.value).typeName;
  }

  addAttributeType(attributeTypeId: Guid) {
    (this.searchForm.get('attributes') as FormArray).push(new FormGroup({
      'AttributeTypeId': new FormControl(attributeTypeId, Validators.required),
      'AttributeValue': new FormControl(null),
    }));
  }

  onDeleteIAttribute(index: number) {
    console.log(index);
  }

  onSubmit() {
    if (this.attributesPresent()) {
      this.searchForm.get('attributes').enable();
    } else {
      this.searchForm.get('attributes').disable();
    }
    const nameOrValue = this.searchForm.get('nameOrValue');
    if (nameOrValue.value) {
      nameOrValue.enable();
    } else {
      nameOrValue.disable();
    }
    this.searchService.search(this.searchForm.value as SearchContent);
  }

}
