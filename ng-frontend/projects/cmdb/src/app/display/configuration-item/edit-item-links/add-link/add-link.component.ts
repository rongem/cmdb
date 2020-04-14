import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid, ItemLink, AppConfigService } from 'backend-access';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit {
  link = new ItemLink();
  validLink = false;

  constructor(public dialogRef: MatDialogRef<AddLinkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.link.uri = 'https://';
    this.link.itemId = this.data;
    this.link.id = Guid.create().toString();
  }

  get validURL() {
    return AppConfigService.validURL(this.link.uri);
  }

  onSave() {
    this.dialogRef.close(this.link);
  }

  validateLink() {
    window.open(this.link.uri, '_blank');
  }
}
