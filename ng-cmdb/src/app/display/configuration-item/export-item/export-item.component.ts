import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Guid } from 'src/app/shared/guid';
import { getUrl } from 'src/app/shared/store/functions';

@Component({
  selector: 'app-export-item',
  templateUrl: './export-item.component.html',
  styleUrls: ['./export-item.component.scss']
})
export class ExportItemComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExportItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog,
              private http: HttpClient) { }

  ngOnInit() {
  }

}
