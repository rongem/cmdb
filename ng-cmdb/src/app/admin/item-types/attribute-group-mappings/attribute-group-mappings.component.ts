import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemType } from 'src/app/shared/objects/item-type.model';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit, OnDestroy {
  meta: Observable<fromMetaData.State>;
  mappings: ItemTypeAttributeGroupMapping[];
  subscription: Subscription;
  deletionMap: Map<Guid, boolean> = new Map<Guid, boolean>();

  constructor(
    public dialogRef: MatDialogRef<ItemTypeAttributeGroupMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    private metaDataService: MetaDataService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
    this.subscription = this.meta.subscribe(state => {
      this.mappings = state.itemTypeAttributeGroupMappings.filter(m => m.ItemTypeId === this.data.TypeId);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: Guid) {
    return attributeTypes.filter(at => at.AttributeGroup === attributeGroupId)
      .map(at => at.TypeName).join('\n');
  }

  canDeleteMapping(attributeGroup: AttributeGroup) {
    if (!this.isSelected(attributeGroup.GroupId)) {
      return of(true);
    }
    if (this.deletionMap.has(attributeGroup.GroupId)) {
      return of(this.deletionMap.get(attributeGroup.GroupId));
    }
    const mapping: ItemTypeAttributeGroupMapping = {
      GroupId: attributeGroup.GroupId,
      ItemTypeId: this.data.TypeId,
    };
    return this.metaDataService.canDeleteMapping(mapping).pipe(
      tap(value => this.deletionMap.set(attributeGroup.GroupId, value))
    );
  }

  onListClick(event: MatSelectionListChange) {
    console.log(event.option.value, event.option.selected);
  }

  onChange(event: MatSlideToggleChange, attributeGroup: AttributeGroup) {
    if (event.checked) {
      const mapping: ItemTypeAttributeGroupMapping = {
        GroupId: attributeGroup.GroupId,
        ItemTypeId: this.data.TypeId,
      };
      this.store.dispatch(new MetaDataActions.AddItemTypeAttributeGroupMapping(mapping));
    } else {
      const mapping = this.mappings.find(m => m.GroupId === attributeGroup.GroupId);
      this.store.dispatch(new MetaDataActions.DeleteItemTypeAttributeGroupMapping(mapping));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  isSelected(guid: Guid) {
    return this.mappings.findIndex(m => m.GroupId === guid) > -1;
  }

  log(event: Event) {
    console.log(event);
  }

}
