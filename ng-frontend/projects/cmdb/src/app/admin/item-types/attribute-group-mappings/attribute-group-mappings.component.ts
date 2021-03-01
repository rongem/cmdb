import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ItemType, ItemTypeAttributeGroupMapping, AttributeType, AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';

import { ConfirmDeleteMappingComponent } from '../../shared/confirm-delete-mapping/confirm-delete-mapping.component';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit, OnDestroy {
  private mappings: ItemTypeAttributeGroupMapping[];
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ItemTypeAttributeGroupMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // better: take(1) ?
    this.subscription = this.store.select(MetaDataSelectors.selectItemTypeAttributeGroupMappings).subscribe(mappings => {
        this.mappings = mappings.filter(m => m.itemTypeId === this.data.id);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  onChange(event: MatSlideToggleChange, attributeGroup: AttributeGroup) {
    if (event.checked) {
      const mapping: ItemTypeAttributeGroupMapping = {
        attributeGroupId: attributeGroup.id,
        itemTypeId: this.data.id,
      };
      this.store.dispatch(AdminActions.addItemTypeAttributeGroupMapping({mapping}));
    } else {
      const mapping = this.mappings.find(m => m.attributeGroupId === attributeGroup.id);
      const dialogRef = this.dialog.open(ConfirmDeleteMappingComponent, {
        width: 'auto',
        // class:
        data: mapping,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.store.dispatch(AdminActions.deleteItemTypeAttributeGroupMapping({mapping}));
        } else {
          event.source.checked = true;
        }
      });
    }
  }

  isSelected(guid: string) {
    return this.mappings.findIndex(m => m.attributeGroupId === guid) > -1;
  }
}
