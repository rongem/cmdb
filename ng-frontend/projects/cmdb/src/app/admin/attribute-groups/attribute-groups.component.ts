import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AttributeGroup, AdminActions, MetaDataSelectors } from 'backend-access';

@Component({
  selector: 'app-attribute-groups',
  templateUrl: './attribute-groups.component.html',
  styleUrls: ['./attribute-groups.component.scss']
})
export class AttributeGroupsComponent implements OnInit {
  activeGroup: string;
  createMode = false;

  constructor(private store: Store) { }

  get attributeGroups() {
    return this.store.select(MetaDataSelectors.selectAttributeGroups);
  }

  ngOnInit() {
  }

  getAttributeTypesOfGroup(attributeGroupId: string) {
    return this.store.select(MetaDataSelectors.selectAttributeTypesInGroup(attributeGroupId));
  }

  getAttributeTypeNamesOfGroup(attributeGroupId: string) {
    return this.getAttributeTypesOfGroup(attributeGroupId).pipe(
      map(attributeTypes => attributeTypes.map(at => at.name).join(', ')),
    );
  }

  getAttributeMappingsOfGroup(attributeGroupId: string) {
    return this.store.select(MetaDataSelectors.selectItemTypesForAttributeGroup(attributeGroupId)).pipe(map(result => result.length));
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
