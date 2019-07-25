import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';

@Component({
  selector: 'app-attribute-groups',
  templateUrl: './attribute-groups.component.html',
  styleUrls: ['./attribute-groups.component.scss']
})
export class AttributeGroupsComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  activeGroup: Guid;
  groupName: string;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>) { }

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

  onCreate() {
    this.activeGroup = undefined;
    this.groupName = '';
    this.createMode = true;
  }

  onCreateAttributeGroup(event: Event) {
    if (this.groupName && this.groupName.length > 3) {
      const attributeGroup = new AttributeGroup();
      attributeGroup.GroupId = Guid.create();
      attributeGroup.GroupName = this.groupName;
      this.store.dispatch(new MetaDataActions.AddAttributeGroup(attributeGroup));
      this.onCancel(event);
    }
  }

  onChangeAttributeGroupName(event: Event, attributeGroup: AttributeGroup) {
    const updatedAttributeGroup = {
      ...attributeGroup,
      GroupName: this.groupName,
    };
    this.store.dispatch(new MetaDataActions.UpdateAttributeGroup(updatedAttributeGroup));
    this.onCancel(event);
  }

  onSetGroup(attributeGroup: AttributeGroup) {
    this.activeGroup = attributeGroup.GroupId;
    this.groupName = attributeGroup.GroupName;
    this.createMode = false;
  }

  onCancel(event: Event) {
    this.activeGroup = undefined;
    this.groupName = undefined;
    this.createMode = false;
    event.stopPropagation();
  }

  onDeleteAttributeGroup(event: Event, attributeGroup: AttributeGroup) {
    this.store.dispatch(new MetaDataActions.DeleteAttributeGroup(attributeGroup));
    event.stopPropagation();
  }

}
