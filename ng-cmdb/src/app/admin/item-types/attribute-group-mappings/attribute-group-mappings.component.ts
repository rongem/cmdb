import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';

@Component({
  selector: 'app-item-type-attribute-group-mappings',
  templateUrl: './attribute-group-mappings.component.html',
  styleUrls: ['./attribute-group-mappings.component.scss']
})
export class ItemTypeAttributeGroupMappingsComponent implements OnInit {
  meta: Observable<fromMetaData.State>;

  constructor(
    public dialogRef: MatDialogRef<ItemTypeAttributeGroupMappingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    private metaDataService: MetaDataService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onListClick(event: MatSelectionListChange) {
    console.log(event.option.value, event.option.selected);
  }

  onCancel() {
    this.dialogRef.close();
  }

  isSelected(guid: Guid, mappings: ItemTypeAttributeGroupMapping[]) {
    return mappings.findIndex(m => m.GroupId === guid && m.ItemTypeId === this.data.TypeId) > -1;
  }

  log(event: Event) {
    console.log(event);
  }

}
