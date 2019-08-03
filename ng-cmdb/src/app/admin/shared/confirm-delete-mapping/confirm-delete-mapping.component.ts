import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromMetaData from 'src/app/shared/store/meta-data.reducer';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemTypeAttributeGroupMapping } from 'src/app/shared/objects/item-type-attribute-group-mapping.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-delete-mapping',
  templateUrl: './confirm-delete-mapping.component.html',
  styleUrls: ['./confirm-delete-mapping.component.scss']
})
export class ConfirmDeleteMappingComponent implements OnInit {
  meta: Observable<fromMetaData.State>;
  ready = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemTypeAttributeGroupMapping,
    private metaDataService: MetaDataService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.meta = this.store.select(fromApp.METADATA);
  }

  onCancel() {
    this.dialogRef.close();
  }

  getAttributesCount() {
    return this.metaDataService.countMapping(this.data).pipe(tap(() => this.ready = true));
  }

}
