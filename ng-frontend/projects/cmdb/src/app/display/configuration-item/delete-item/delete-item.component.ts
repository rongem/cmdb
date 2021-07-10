import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditActions } from 'backend-access';
import { DisplaySelectors } from '../../../shared/store/store.api';


@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {

  constructor(private store: Store,
              public dialogRef: MatDialogRef<DeleteItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              public dialog: MatDialog,
              ) { }

  ngOnInit() {
  }

  get item() {
    return this.store.select(DisplaySelectors.selectDisplayConfigurationItem);
  }

  onDeleteItem() {
    this.store.dispatch(EditActions.deleteConfigurationItem({itemId: this.data}));
    this.dialogRef.close();
  }

}
