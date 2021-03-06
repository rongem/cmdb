import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid, EditActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              public dialogRef: MatDialogRef<DeleteItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              public dialog: MatDialog,
              ) { }

  ngOnInit() {
  }

  get item() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  onDeleteItem() {
    this.store.dispatch(EditActions.deleteConfigurationItem({itemId: this.data}));
    this.dialogRef.close();
  }

}
