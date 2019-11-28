import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Guid } from 'src/app/shared/guid';
import { getUrl } from 'src/app/shared/store/functions';

@Component({
  selector: 'app-export-items',
  templateUrl: './export-items.component.html',
  styleUrls: ['./export-items.component.scss']
})
export class ExportItemsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExportItemsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog,
              private http: HttpClient) { }

  ngOnInit() {
  }

}
