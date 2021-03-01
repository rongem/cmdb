import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../app/shared/store/app.reducer';
import * as LocalAdminActions from '../store/admin.actions';

import { AttributeGroupItemTypeMappingsComponent } from './item-type-mappings/item-type-mappings.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-attribute-groups',
  templateUrl: './attribute-groups.component.html',
  styleUrls: ['./attribute-groups.component.scss']
})
export class AttributeGroupsComponent implements OnInit {
  activeGroup: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get attributeGroups() {
    return this.store.select(MetaDataSelectors.selectAttributeGroups);
  }

  getAttributeTypesOfGroup(attributeGroupId: string) {
    return this.store.select(MetaDataSelectors.selectAttributeTypesInGroup, attributeGroupId);
  }

  getAttributeTypeNamesOfGroup(attributeGroupId: string) {
    return this.getAttributeTypesOfGroup(attributeGroupId).pipe(
      map(attributeTypes => attributeTypes.map(at => at.name).join('\n')),
    );
  }

  getAttributeMappingsOfGroup(attributeGroupId: string) {
    return this.store.select(MetaDataSelectors.selectItemTypesForAttributeGroup, attributeGroupId).pipe(map(result => result.length));
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
    attributeGroup.name = name;
    this.store.dispatch(AdminActions.addAttributeGroup({attributeGroup}));
    this.onCancel();
  }

  onChangeAttributeGroupName(text: string, attributeGroup: AttributeGroup) {
    const updatedAttributeGroup = {
      ...attributeGroup,
      name: text,
    };
    this.store.dispatch(AdminActions.updateAttributeGroup({attributeGroup: updatedAttributeGroup}));
    this.onCancel();
  }

  onSetGroup(attributeGroup: AttributeGroup) {
    this.activeGroup = attributeGroup.id;
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
