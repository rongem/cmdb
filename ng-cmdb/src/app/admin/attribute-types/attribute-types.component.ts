import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';
import { AttributeType } from 'src/app/shared/objects/attribute-type.model';
import { AttributeGroup } from 'src/app/shared/objects/attribute-group.model';

@Component({
  selector: 'app-attribute-types',
  templateUrl: './attribute-types.component.html',
  styleUrls: ['./attribute-types.component.scss']
})
export class AttributeTypesComponent implements OnInit {
  @ViewChild('idToClipboard', { static: false }) idToClipBoard: ElementRef;
  meta: Observable<fromMetaData.State>;
  activeType: Guid;
  typeName: string;
  attributeGroup: Guid;
  createMode = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCreate() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.attributeGroup = undefined;
    this.createMode = true;
  }

  onSetType(attributeType: AttributeType) {
    this.activeType = attributeType.TypeId;
    this.attributeGroup = attributeType.AttributeGroup;
    this.typeName = attributeType.TypeName;
    this.createMode = false;
  }

  onCancel() {
    this.activeType = undefined;
    this.typeName = undefined;
    this.attributeGroup = undefined;
    this.createMode = false;
  }

  onChangeAttributeTypeName(attributeType: AttributeType) {}

  onDeleteAttributeType(attributeType: AttributeType) {}

  onCopyId(id: Guid) {
    console.log(id);
    console.log(this.idToClipBoard);
    this.idToClipBoard.nativeElement.value = id.toString();
    this.idToClipBoard.nativeElement.select();
    console.log(this.idToClipBoard.nativeElement.value);
    document.execCommand('copy');
    console.log(this.idToClipBoard.nativeElement.value);
  }

}
