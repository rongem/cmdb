import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'src/app/shared/guid';
import { ItemLink } from 'src/app/shared/objects/item-link.model';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit {
  link = new ItemLink();
  validLink = false;
  validating = false;

  constructor(public dialogRef: MatDialogRef<AddLinkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.link.LinkURI = 'https://';
    this.link.LinkId = this.data;
  }

  validateLink() {
    if (!this.validURL) {
      return;
    }
    this.validating = true;
    const rx = new XMLHttpRequest();
    rx.timeout = 15000;
    rx.open('GET', this.link.LinkURI);
    rx.onreadystatechange = () => {
      console.log(rx);
      if (rx.readyState === 4) {
        this.validating = false;
        this.validLink = rx.status === 200;
      }
    };
    rx.send();
  }

  get validURL() {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(this.link.LinkURI);
  }

  onSave() {
    this.dialogRef.close(this.link);
  }
}
