import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ItemType, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors, AdminFunctions } from 'backend-access';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit, OnDestroy {
  itemType: ItemType;
  selectedAttributeGroup?: AttributeGroup;
  mappingsCount?: number;
  private selectedCheckbox?: HTMLInputElement;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private store: Store) { }

  ngOnInit() {
    this.subscription = this.route.params.pipe(
      switchMap(params => this.store.select(MetaDataSelectors.selectSingleItemType(params.id))),
    ).subscribe(itemType => {
      if (!itemType) {
        this.returnToItemTypes();
      }
      this.itemType = itemType;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get attributeGroups() {
    return this.store.select(MetaDataSelectors.selectAttributeGroups);
  }

  get attributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypes);
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: string) {
    return attributeTypes.filter(at => at.attributeGroupId === attributeGroupId)
      .map(at => at.name).join('\n');
  }

  onChange(event: Event, attributeGroup: AttributeGroup) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const updatedItemType = ItemType.copy(this.itemType);
      updatedItemType.attributeGroups.push(attributeGroup);
      this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    } else {
      if (this.selectedCheckbox) {
        this.cancelUpdate();
      }
      this.selectedAttributeGroup = attributeGroup;
      this.selectedCheckbox = target;
      this.selectedCheckbox.disabled = true;
      AdminFunctions.countAttributesForMapping(this.http, this.itemType, attributeGroup.id).subscribe(count => this.mappingsCount = count);
    }
  }

  removeMapping() {
    const updatedItemType = ItemType.copy(this.itemType);
    updatedItemType.attributeGroups = updatedItemType.attributeGroups.filter(ag => ag.id !== this.selectedAttributeGroup.id);
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.deleteSelection();
  }

  cancelUpdate() {
    this.selectedCheckbox.checked = true;
    this.deleteSelection();
  }


  isSelected(id: string) {
    return this.itemType.attributeGroups.findIndex(ag => ag.id === id) > -1;
  }

  returnToItemTypes() {
    this.router.navigateByUrl('/admin/item-types');
  }

  private deleteSelection() {
    this.selectedCheckbox.disabled = false;
    this.selectedCheckbox = undefined;
    this.selectedAttributeGroup = undefined;
    this.mappingsCount = undefined;
  }
}
