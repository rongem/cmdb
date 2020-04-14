import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemTypeAttributeGroupMapping, MetaDataSelectors } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';

import { AdminService } from '../../admin.service';

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
    @Inject(MAT_DIALOG_DATA) public data: ItemTypeAttributeGroupMapping,
    private adminService: AdminService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
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

  getItemType(itemTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType, itemTypeId);
  }

  getAttributeGroup(groupId: string) {
    return this.store.select(MetaDataSelectors.selectSingleAttributeGroup, groupId);
  }

}
