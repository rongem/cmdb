import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetaDataSelectors, AdminFunctions, ItemType } from 'backend-access';

@Component({
  selector: 'app-confirm-delete-mapping',
  templateUrl: './confirm-delete-mapping.component.html',
  styleUrls: ['./confirm-delete-mapping.component.scss']
})
export class ConfirmDeleteMappingComponent implements OnInit {
  ready = false;
  attributesCount = -1;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {itemType: ItemType; attributeGroupId: string},
    private http: HttpClient,
    private store: Store) { }

  ngOnInit() {
  }

  getAttributesCount() {
    if (this.ready) {
      return of(this.attributesCount);
    }
    return AdminFunctions.countAttributesForMapping(this.http, this.data.itemType, this.data.attributeGroupId).pipe(tap((value) => {
      this.attributesCount = value;
      this.ready = true;
    }));
  }

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(itemTypeId));
  }

  getAttributeGroup(groupId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeGroup(groupId));
  }

}
