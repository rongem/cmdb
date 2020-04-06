import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromMetaData from 'projects/cmdb/src/app/shared/store/meta-data.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';

import { AdminService } from 'projects/cmdb/src/app/admin/admin.service';
import { ItemTypeAttributeGroupMapping } from 'projects/cmdb/src/app/shared/objects/item-type-attribute-group-mapping.model';
import { tap } from 'rxjs/operators';
import { Guid } from 'backend-access';

@Component({
  selector: 'app-confirm-delete-mapping',
  templateUrl: './confirm-delete-mapping.component.html',
  styleUrls: ['./confirm-delete-mapping.component.scss']
})
export class ConfirmDeleteMappingComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  ready = false;
  attributesCount = -1;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemTypeAttributeGroupMapping,
    private adminService: AdminService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  getAttributesCount() {
    if (this.ready) {
      return of(this.attributesCount);
    }
    return this.adminService.countMapping(this.data).pipe(tap((value) => {
      this.attributesCount = value;
      this.ready = true;
    }));
  }

  getItemType(itemTypeId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleItemType, itemTypeId);
  }

  getAttributeGroup(groupId: Guid) {
    return this.store.select(fromSelectMetaData.selectSingleAttributeGroup, groupId);
  }

}