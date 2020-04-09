import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid, AttributeType, AttributeGroup, ItemTypeAttributeGroupMapping, AdminActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromMetaData from 'projects/cmdb/src/app/shared/store/meta-data.reducer';
import * as LocalAdminActions from 'projects/cmdb/src/app/admin/store/admin.actions';

import { AttributeGroupItemTypeMappingsComponent } from './item-type-mappings/item-type-mappings.component';

@Component({
  selector: 'app-attribute-groups',
  templateUrl: './attribute-groups.component.html',
  styleUrls: ['./attribute-groups.component.scss']
})
export class AttributeGroupsComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  activeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  getAttributeTypesOfGroup(attributeTypes: AttributeType[], attributeGroupId: Guid) {
    return attributeTypes.filter(at => at.AttributeGroup === attributeGroupId);
  }

  getAttributeTypeNamesOfGroup(attributeTypes: AttributeType[], attributeGroupId: Guid) {
    return attributeTypes.filter(at => at.AttributeGroup === attributeGroupId)
      .map(at => at.TypeName).join('\n');
  }

  getAttributeMappingsOfGroup(attributeGroupMappings: ItemTypeAttributeGroupMapping[], attributeGroupId: Guid) {
    return attributeGroupMappings.filter(m => m.GroupId === attributeGroupId);
  }

  onManageMappings(attributeGroup: AttributeGroup) {
    const dialogRef = this.dialog.open(AttributeGroupItemTypeMappingsComponent, {
      width: 'auto',
      // class:
      data: attributeGroup,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(LocalAdminActions.setCurrentItemType(undefined));
      this.onCancel();
    });
  }

  onCreate() {
    this.activeGroup = undefined;
    this.createMode = true;
  }

  onCreateAttributeGroup(name: string) {
    const attributeGroup = new AttributeGroup();
    attributeGroup.GroupId = Guid.create();
    attributeGroup.GroupName = name;
    this.store.dispatch(AdminActions.addAttributeGroup({attributeGroup}));
    this.onCancel();
  }

  onChangeAttributeGroupName(text: string, attributeGroup: AttributeGroup) {
    const updatedAttributeGroup = {
      ...attributeGroup,
      GroupName: text,
    };
    this.store.dispatch(AdminActions.updateAttributeGroup({attributeGroup: updatedAttributeGroup}));
    this.onCancel();
  }

  onSetGroup(attributeGroup: AttributeGroup) {
    this.activeGroup = attributeGroup.GroupId;
    this.createMode = false;
  }

  onCancel() {
    this.activeGroup = undefined;
    this.createMode = false;
  }

  onDeleteAttributeGroup(attributeGroup: AttributeGroup) {
    this.store.dispatch(AdminActions.deleteAttributeGroup({attributeGroup}));
  }
}
