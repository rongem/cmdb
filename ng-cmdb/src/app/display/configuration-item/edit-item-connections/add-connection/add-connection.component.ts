import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'src/app/shared/guid';
import { ConnectionRule } from 'src/app/shared/objects/connection-rule.model';
import { Connection } from 'src/app/shared/objects/connection.model';

@Component({
  selector: 'app-add-connection',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss']
})
export class AddConnectionComponent implements OnInit {
  connection = new Connection();

  constructor(public dialogRef: MatDialogRef<AddConnectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { rule: ConnectionRule, itemId: Guid},
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  onSave() {
    this.dialogRef.close(this.connection);
  }

}
