import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subscription, switchMap } from 'rxjs';
import { ItemType, AttributeType, AttributeGroup, AdminActions, AdminFunctions, MetaDataSelectors } from 'backend-access';


@Component({
    selector: 'app-attribute-group-item-type-mappings',
    templateUrl: './item-type-mappings.component.html',
    styleUrls: ['./item-type-mappings.component.scss'],
    standalone: false
})
export class AttributeGroupItemTypeMappingsComponent implements OnInit, OnDestroy {
  attributeGroup: AttributeGroup;
  selectedItemType?: ItemType;
  mappingsCount?: number;
  private selectedCheckbox?: HTMLInputElement;
  private itemTypesWithAttributeGroup: ItemType[];
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private store: Store) { }

    get itemTypes() {
      return this.store.select(MetaDataSelectors.selectItemTypes);
    }

    ngOnInit() {
    this.subscription = this.route.params.pipe(
      switchMap(params => this.store.select(MetaDataSelectors.selectSingleAttributeGroup(params.id))),
      switchMap(attributeGroup => {
        if (!attributeGroup) {
          this.returnToAttributeGroups();
          return of([] as ItemType[]);
        }
        this.attributeGroup = attributeGroup;
        return this.store.select(MetaDataSelectors.selectItemTypesByAttributeGroup(attributeGroup.id));
      })
    ).subscribe(itemTypes => {
      this.itemTypesWithAttributeGroup = itemTypes;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: string) {
    return attributeTypes.filter(at => at.attributeGroupId === attributeGroupId)
      .map(at => at.name).join('\n');
  }

  onChange(event: Event, itemType: ItemType) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const updatedItemType = ItemType.copy(itemType);
      updatedItemType.attributeGroups.push(this.attributeGroup);
      this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    } else {
      if (this.selectedCheckbox) {
        this.cancelUpdate();
      }
      this.selectedItemType = itemType;
      this.selectedCheckbox = target;
      this.selectedCheckbox.disabled = true;
      AdminFunctions.countAttributesForMapping(this.http, itemType, this.attributeGroup.id).subscribe(count => this.mappingsCount = count);
    }
  }

  cancelUpdate() {
    this.selectedCheckbox.checked = true;
    this.deleteSelection();
  }

  removeMapping() {
    const updatedItemType = ItemType.copy(this.selectedItemType);
    updatedItemType.attributeGroups = updatedItemType.attributeGroups.filter(ag => ag.id !== this.attributeGroup.id);
    this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
    this.deleteSelection();
  }

  isSelected(id: string) {
    return this.itemTypesWithAttributeGroup.findIndex(m => m.id === id) > -1;
  }

  returnToAttributeGroups() {
    this.router.navigateByUrl('/admin/attribute-groups');
  }

  private deleteSelection() {
    this.selectedCheckbox.disabled = false;
    this.selectedCheckbox = undefined;
    this.selectedItemType = undefined;
    this.mappingsCount = undefined;
  }


}
