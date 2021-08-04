import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { ItemType, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import { ConfirmDeleteMappingComponent } from '../../shared/confirm-delete-mapping/confirm-delete-mapping.component';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-attribute-group-item-type-mappings',
  templateUrl: './item-type-mappings.component.html',
  styleUrls: ['./item-type-mappings.component.scss']
})
export class AttributeGroupItemTypeMappingsComponent implements OnInit, OnDestroy {
  public attributeGroup: AttributeGroup;
  private itemTypesWithAttributeGroup: ItemType[];
  private subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) { }

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
    this.subscription.unsubscribe();
  }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
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
      const dialogRef = this.dialog.open(ConfirmDeleteMappingComponent, {
        width: 'auto',
        // class:
        data: {itemType, attributeGroupId: this.attributeGroup.id},
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          const updatedItemType = ItemType.copy(itemType);
          updatedItemType.attributeGroups = updatedItemType.attributeGroups.filter(ag => ag.id !== this.attributeGroup.id);
          this.store.dispatch(AdminActions.updateItemType({itemType: updatedItemType}));
        } else {
          target.checked = true;
        }
      });
    }
  }

  isSelected(id: string) {
    return this.itemTypesWithAttributeGroup.findIndex(m => m.id === id) > -1;
  }

  returnToAttributeGroups() {
    this.router.navigateByUrl('/admin/attribute-groups');
  }
}
